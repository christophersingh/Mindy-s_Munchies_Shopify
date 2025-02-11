var AT_AjaxSearch = {
  ajaxProductItems : function( input_element, result_wrapper, result_element ){
    var search_url  = '/search'
        ,result     = new Array()
        ,_keyword   = input_element.val();

    jQuery.ajax({
        type: 'GET',
        data: {
            q: "*" + _keyword + "*",
            type: "product",
            view: "json",
        },
        dataType: "json",      
        url: search_url,
        complete:function(){
            jQuery('.searchbox').removeClass("s-loading");
        },
        success: function ( json_reponse ) {
          result_element.html(" ");
          if( json_reponse.length > 0 ){
            for (var i = 0; i < json_reponse.length; i++) {

              var item              = json_reponse[i]
                  ,title            = item.title
                  ,price            = item.price
                  ,handle           = item.handle
                  ,image            = item.featured_image
                  ,compare_price    = item.has_compare_price  ? '<span class="price-compare">' + item.compare_price + '</span>' : ""
                  ,compare_class    = item.has_compare_price  ? "price-sale" : "price"
                  ,price_class       = item.available          ? "" : " sold-out "
                  ,price            = item.available          ? item.price : item.out_stock_nofication
                  ,markedString     = title.replace(new RegExp('(' + _keyword + ')', 'gi'), '<span class="marked">$1</span>')
                  ,template         = '<li class="result-item just-added" style="display:none;">'
                                      + '<a class="search-item-img" href="'+ handle +'">'
                                      + '<img style="max-width: 60px; float: left;" src="' + image + '" />' 
                                      +'</a>'
                                      +'<a class="search-item-title" href="'+ handle +'">' + markedString +'</a>'
                                      + compare_price
                                      +'<span class="'+ compare_class + price_class +'">'+ price + '</span>'
                                      +'</li>';
                 result_element.append(template);
                 setTimeout(function() {
                    result_element.children('li.result-item.just-added').removeClass('just-added').slideDown(600);
                 },300); 
            }
            
            if($('#result-ajax-search .search-results li').length){
              $('#result-ajax-search').show();
              currenciesCallbackSpecial('#result-ajax-search span.money');
            }
          }else{
            result_element.html('<li class="result-item"><p>No result found for your search.</p></li>');
             $('#result-ajax-search').show();
          }
       }     
    });

  }

  ,ajaxSearch : function( bc_search_config  ){
    
    var     ajax_timeout
    		,ajax_lost_focus
            ,ajax_search        = this
            ,search_input_id    = bc_search_config.search_input.length   > 0   ? bc_search_config.search_input    : '#bc-product-search'
            ,wrapper_id         = bc_search_config.result_wrapper.length > 0   ? bc_search_config.result_wrapper  : '#result-ajax-search'
            ,result_id          = bc_search_config.result_element.length > 0   ? bc_search_config.result_element  : '.search-results'
            ;


    jQuery( document ).delegate( search_input_id ,'keyup',function( event ){
      var _keyword           = jQuery(this).val()
          ,search_element    = jQuery(this)
          ,result_wrapper    = jQuery( wrapper_id )
          ,result_element    = result_wrapper.children( result_id );
        
      if( ajax_timeout ){ 
        clearTimeout(ajax_timeout);
      } 

      //wait 300 mili seconds to avoid request too much search
      ajax_timeout = setTimeout(function() {
        if( _keyword.length >= 2 ){
            jQuery(this).removeClass('error warning valid').addClass('valid');
            jQuery('.searchbox').addClass("s-loading");
            ajax_search.ajaxProductItems( search_element ,result_wrapper, result_element );
        }else{
            jQuery(this).removeClass('error warning valid').addClass('error');
            result_element.html('<li><p>You must enter at least 2 characters.</p></li>');
        } 
      },300);       
    }); 

    jQuery( document ).delegate( '#search.navbar-form' ,'blur',function( event ){
        
      var _search_block = jQuery(this);
      if( ajax_lost_focus ){ 
        clearTimeout(ajax_lost_focus);
      } 

      //wait 300 mili seconds to avoid request too much search
      ajax_lost_focus = setTimeout(function() {
		jQuery('#result-ajax-search').hide();
      },1500);       
    });


    
  }

  ,init : function( bc_search_config ){
    this.ajaxSearch( bc_search_config );
  }
}

jQuery(document).ready(function($) {

  AT_AjaxSearch.init({
      "search_input"      :   "#bc-product-search"
      ,"result_wrapper"   :   "#result-ajax-search"
      ,"result_element"   :   ".search-results"
      ,"strictly_mode"    :   0
  });
})