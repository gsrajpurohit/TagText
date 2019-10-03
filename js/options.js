$(function() {

    $('.input-tag-text1').tagText({
        autoHeight: false,
        duration: 100,
        theme: 'green',
        remote: [{id: 141, text: "Geological Mapping"},
                {id: 142, text: "Geophysics"},
                {id: 139, text: "Geotechnical Engineering"},
                {id: 143, text: "Go-to-market Strategy"},
                {id: 29, text: "Google Analytics"},
                {id: 120, text: "Google Docs"}],
        showSelected: true,
        deleteIconHtml: '<i class="fa fa-trash"></i>'
    });
    $('.input-tag-text2').tagText({
        autoHeight: true,
        maxHeight: 250, // digits/string
        duration: 100,
        theme: 'red',
        remote: 'get_object.php',
        preselected: [{
            id: 3,
            text: 'Aerospace Industries'
        },{
            id: 9,
            text: 'Applied Mathematics'
        }],
        showSelected: true,
        deleteIconHtml: '<i class="fa fa-times"></i>',
        onSelect: function(values){
            console.log('return values: ', values);
        }
    });
    $('#get_first').on('click', function(event) {
        event.preventDefault();
        $('.input-tag-text1').tagText('get_tags');
    });
    $('#get_sec').on('click', function(event) {
        event.preventDefault();
        $('.input-tag-text2').tagText('get_tags');
    });
})

