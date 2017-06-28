




//jQuery is required to run this code
$( document ).ready(function() {

    var templateHTML = "<div id='teste' class='x'>Algum texto</div>";
    var posicao = templateHTML.indexOf("id=", 0)
    var auxiliar = templateHTML.indexOf("'", posicao)+1;
    var auxiliar2 = templateHTML.indexOf("'", auxiliar+1);
    var oQueEuQuero = templateHTML.substring(auxiliar, auxiliar2);
    console.log("Teste Antonio");
    console.log(posicao);
    console.log(auxiliar);
    console.log(auxiliar2);
    console.log(oQueEuQuero);


    $(window).on('resize', function() {
        console.log("Teste");
    });


    //===mudança do tamanhdo da fonte de acordo com dimensão da tela===
        
    //======

    var selectedNav = "#homeNav";
    $("#homeNav").css({
        "background-color": "#1f245b",
        "color": "white",
        "font-weight": "bold"
    });


    $("#homeNav").click(function() {
        var aux = selectedNav;
        selectedNav = "#homeNav";
        changeNav(aux,selectedNav);

        $("html, body").animate({ scrollTop: 0 }, 1000);

    });


    $("#sobreNav").click(function() {
        var aux = selectedNav;
        selectedNav = "#sobreNav";
        changeNav(aux,selectedNav);

        $('html, body').animate({
            scrollTop: $("#divSobre").offset().top - 90
        }, 1000);
    });

    $("#servicosNav").click(function() {
        var aux = selectedNav;
        selectedNav = "#servicosNav";
        changeNav(aux,selectedNav);

        $('html, body').animate({
            scrollTop: $("#divServicos").offset().top - 90
        }, 1000);

    });

    $("#noticiasNav").click(function() {
        var aux = selectedNav;
        selectedNav = "#noticiasNav";
        changeNav(aux,selectedNav);

        $('html, body').animate({
            scrollTop: $("#divBlog").offset().top - 90
        }, 1000);

    });

    $("#contatoNav").click(function() {
        var aux = selectedNav;
        selectedNav = "#contatoNav";
        changeNav(aux,selectedNav);
        $('html, body').animate({
            scrollTop: $("#footer").offset().top
        }, 1000);
    });


    function changeNav(oldTarget, newTarget){
        $(oldTarget).css({
            "background-color": "white",
            "color": "black",
            "font-weight": "normal"
        });

        $(newTarget).css({
            "background-color": "#1f245b",
            "color": "white",
            "font-weight": "bold"
        });
    }

    /*
    function selecNav(target){
        var targetsList = ["#homeNav", "#sobreNav", "#servicosNav", "#noticiasNav", "#contatoNav"];
        for (var i=0; i<targetsList.length; i++){

        }
    }
    */
});
