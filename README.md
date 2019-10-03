# TagText
This will stylizes your input that allows a you to type keywords, which will be broken up into tokens/tags.

###  Get a copy of the plugin
You can download the plugin from GitHub.

###  Load the required files
Inside the page's head tag include the desired CSS file.

In the page's footer, just before, include the required plugin files.

###  Create the HTML markup
`<input type="text" name="term" class="input-tag" />`

### Instantiate the Plugin
```
<script type="text/javascript">
    jQuery( document ).ready(function( $ ) { 
        $( '.input-tag' ).poper({
            /* available options */
        })
    }); 
</script>

```

### Available options
```
{
        autoHeight: true, // if you want to set the below maximum height for the container
        maxHeight: 100, // digits/string
        duration: 100, // dropdown show/hide duration
        theme: 'yellow', // container/dropdown color theme
        showSelected: false, // show/hide already selected values
        showSelectedDisabled: true, // show disabled to already selected values
        remote: false, // array of objects[{'id': 1, 'text': 'Test 1'},{'id': 2, 'text': 'Test 2'}] / valid url
        preselected: false, // array of objects of pre selected values
        deleteIconHtml: '&#x2715;', // can place html
        onSelect: function() {return true;},
    }
```

### Available Method
```
$('.input-tag').tagText('get_tags');

```

### Example
![Screenshot](tag-text-1.png)

![Screenshot](tag-text-2.png)

### Demo
[Demo](https://gsrajpurohit.github.io/TagText/).

### Support
If you found a bug or have a feature suggestion, please email me on rajpurohitganpat@gmail.com.
If you need help with implementing the "Poper" in your project feel free to contact me on rajpurohitganpat@gmail.com.

License The plugin is available under the [MIT license](https://opensource.org/licenses/MIT).
