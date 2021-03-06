var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre')
var sala = params.get('sala')

//Referencias
var divUsuarios = $("#divUsuarios");
var formEnviar = $("#formEnviar  ");
var txtMensaje = $("#txtMensaje");
var divChatbox = $("#divChatbox");
//Funciones para renderizar

function renderizarUsuarios(personas) {
	console.log(personas);
	var html = "";

	html += "<li>";
	html +=
		'<a href="javascript:void(0)" class="active"> Chat de <span> ' +
		params.get("sala") +
		"</span></a>";
	html += "</li>";

	for (var i = 0; i < personas.length; i++) {
		html += "<li>";
		html +=
			"<a data-id=" +
			personas[i].id +
			' href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' +
			personas[i].nombre +
			'<small class="text-success">online</small></span></a>';
		html += "</li>";
	}
	divUsuarios.html(html);
}

function renderizarImagenes(mensaje,yo){
	html ="";


	if(!yo ) {
		html +='<li class="animated fadeIn">'
		html +='<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
		html +='<div class="chat-content">'
		html +='<h5>'+ mensaje.nombre +'</h5>'
		html +='<div class="box bg-light-info"> '+ mensaje.mensaje+'</div>'
		html +='</div>'
		html +='<div class="chat-time">10:56 am</div>'
		html +='</li>'
	} else {
		html +='<li class="reverse">'
		html +='<div class="chat-content">'
		html +='<h5>'+ mensaje.nombre +'</h5>'
		html +='<div class="box bg-light-inverse">'+ mensaje.mensaje+'</div>'
		html +='</div>'
		html +='<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
		html +='<div class="chat-time">10:57 am</div>'
		html +='</li>'
	}
	divChatbox.append(html);
	scrollBottom();

}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//Listeners
formEnviar.on("submit", function (e) {
	e.preventDefault();
	console.log(txtMensaje.val().trim());
	// Enviar información
	socket.emit('crearMensaje', {
    	nombre: nombre,
    	mensaje: txtMensaje.val()
 	}, function(resp) {
		txtMensaje.val('').focus();
		renderizarImagenes(resp,true);
		scrollBottom();

 });
});
