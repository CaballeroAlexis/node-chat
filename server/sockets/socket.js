const { io } = require("../server");
const { Usuarios } = require("../classes/usuarios");
const { crearMensaje } = require("../utils/utilidades");

const usuarios = new Usuarios();

io.on("connection", (client) => {
	client.on("entrarChat", (usuario, callback) => {
		if (!usuario.nombre || !usuario.sala) {
			return callback({
				err: true,
				message: "El nombre es necesario",
			});
        }
        client.join(usuario.sala);
		let personas = usuarios.agregarPersonas(client.id, usuario.nombre,usuario.sala);
		client.broadcast.to(usuario.sala).emit("listaPersona", usuarios.getPersonasPorSala(usuario.sala));
		callback(personas);
    });
    
    client.on('crearMensaje', (data,callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre,data.mensaje)
		client.broadcast.to(persona.sala).emit('crearMensaje',mensaje);
		callback(mensaje);
    })

	client.on("disconnect", () => {
		let personaBorrada = usuarios.borrarPersona(client.id);
		client.broadcast.to(personaBorrada.sala).emit(
			"crearMensaje",
			crearMensaje(
				"Administrador",
				personaBorrada.nombre + " Abandonó el chat"
			)
		);
		client.broadcast.to(personaBorrada.sala).emit("listaPersona", usuarios.getPersonasPorSala(personaBorrada.sala));
    });
    

    //Mensaje privado
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre,data.mensaje))
    })
});
