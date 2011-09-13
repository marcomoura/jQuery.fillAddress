/*
* @Copyright (c) 2011 Marco Moura (email@marcomoura.com)
* @Page http://github.com/marcomoura
* @Version: 0.1
* @Release: 2011-09-05
* @author Marco Moura
* @use Atribuir o método fillAddress() em um input de cep, o autopreenchimento será através do evendo Change(), os parâmetros são opcionais, fornecer apenas ser for necessário alterar os valores dos nomes dos inputs e da url do servidor para consulta do CEP
* $("#cep").fillAddress({
*		inputs = {
*			"address_type" : "id_input_type_address",
*			"address" : "id_input_address",
*			"neighborhood" : "id_input_neighborhood",
*			"city" : "id_input_city",
*			"uf" : "id_input_uf",
			"postal_code" : "id_input__postal_code"
*			},	
*		 options = {
*			"server" = : "/search/address"
*		}
* });
* @todo  event click em um botão
*/

(function( $ ) {
	$.fn.fillAddress = function( options ) {
		var st_fillAddress = new plugin_fillAddress( options );
		this.change( function() { 
			var postal_code = $( this ).val() ;
			if ( postal_code != "" ) {
				st_fillAddress.ajax( postal_code ) ;
			}
		 } ) ;
	};

	function plugin_fillAddress ( options ){

		this.warning = "warn";
		this.loading = "load";
		this.success = "success";
	
		this.settings = {
			"input" : {
				"address_type" : "address_type" ,
				"address" : "address" ,
				"neighborhood" : "neighborhood" ,
				"city" : "city" ,
				"state" : "state" ,
				"postal_code" : "client_postal_code"
				} ,
			"server"   : "/search/address" ,
		 } ;

		if ( options ) { 
			$.extend( settings, options ) ;
		}
		
		this.remove_slash = function( postal_code ) {
			return postal_code.replace( /-/,'' ) ;
		} ,

		this.is_valid = function( postal_code ) {
			return ( ! isNaN( postal_code ) ) ;
		} ,

		this.display_error = function( message ) {
			this.status( message , this.warning ) ;
			$( "#" + this.settings.input.postal_code ).focus() ;
			alert( message ) ;
		} ,

		this.status = function( _message , _css_class ){
			$( "#filladdress_status span" ).clearQueue();
			$( "#filladdress_status span" ).attr( "class" , _css_class ).fadeIn( 'slow' ).text( _message ).delay( 5000 ).fadeOut( 'fast' ) ;
		} ,

		this.ajax = function( postal_code ){
			var _in = this.settings.input ;
			if( ! this.is_valid( this.remove_slash( postal_code ) ) ) {
				this.display_error( "O CEP dever ser um valor numérico" ) ;
				return false;
			}
			this.status( "Buscando, aguarde..." , this.loading ) ;
			$.getJSON( this.settings.server , { postal_code : postal_code } function() { 
				} ).success( $.proxy( function( JSON ) {
					try {
						var _capitalize_address_type = JSON.address_type[0].toUpperCase() + JSON.address_type.slice(1).toLowerCase() ;
						$( "#" + _in.address_type ).val( _capitalize_address_type ) ;
						$( "#" + _in.address ).val( JSON.address ) ;
						$( "#" + _in.neighborhood ).val( JSON.neighborhood ) ;
						$( "#" + _in.city ).val( JSON.city ) ;
						$( "#" + _in.state ).val( JSON.state ) ;
						this.status( "Endereço localizado com sucesso." , this.success )
					}
					catch( error ) {
						this.display_error( "Ocorreu um erro ao localizar o cep" );
					}
			} , this )).error( $.proxy( function() { 
				this.display_error( "CEP não localizado" );
			}, this ) ) ;
		} ;
	}
})( jQuery ) ;
