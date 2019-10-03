/*!
 * TagText jQuery Plugin - v1.0.0-beta1
 *
 * Copyright 2017 Ganpat S Rajpurohit, Jaipur.
 *
 * Licensed MIT
 */
if (typeof Object.create !== 'function') {
    Object.create = function(obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function($, window, document, undefined) {
    var ENTER = 13,
        SPACE = 32,
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40;

    var TAG_TEXT = {
        name: 'tagText',
        eFocus: 'focus',
        eKeyup: 'keyup',
        defaultPlacement: 'top',
        isOpen: 'selector_visible',
        _init: function(el, options) {
            this.defaults = $.extend({}, $.fn.tagText.defaults, options);
            this.defaults.selected = [];
            this.$el = $(el);
            $(el).addClass('input-tag-text');
            this.$container = $('<div />', {
                class: 'tag-container'
            });
            this.$selector = $('<div />', {
                'class': 'text-selector'
            });
            this._buildContainer();
            this._setTrigger();

        },
        _buildContainer: function() {
            var self = this,
                el = self.$el;

            self.$container.addClass(self.defaults.theme);
            self.$container.on('click', function(event) {
                if ($(event.target).is($(this))) {
                    el.focus();
                }
            })
            if (self.defaults.autoHeight) {
                self.$container.css('max-height', self.defaults.maxHeight).addClass('scrollable');
            }

            el.wrap(self.$container);
        },
        _setTrigger: function() {
            var self = this;

            self._add_preselected();

            self.$el.on(self.eFocus, function(event) {
                event.preventDefault();
                if ($(this).val().length >= 1) {
                    if (self.$selector.length > 0 && !self.$selector.is(':visible')) {
                        self.$selector.slideDown(self.defaults.duration);
                    }
                }
                if ($(this).val().length >= 1) {
                    self._tagSelection();
                }
                self._hideSelector();
            })
            self.$el.on(self.eKeyup, function(event) {
                event.preventDefault();
                var $this = $(this);
                if ($(this).val().length < 1) {
                    if (self.$selector) {
                        self.$selector.slideUp(self.defaults.duration, function() {
                            $(this).remove();
                        });
                    }
                    return;
                }
                $(this).addClass(self.isOpen);
                setTimeout(function() {
                    self._tagSelection();
                    self._hideSelector();
                }, 1000);
            })
        },
        _tagSelection: function() {
            var self = this,
                el = self.$el;
            var $this = el,
                $parent = $this.parents('.tag-row:first'),
                coordinates = $this.offset();
            var css = {
                left: coordinates.left - ($this.width() / 2) + ($this.outerWidth() / 2),
                top: coordinates.top + $this.outerHeight() + 10,
                right: 'auto'
            };

            if ($('.text-selector').length <= 0) {

                self.$selector.addClass(self.defaults.theme).css(css)
                self.$selector.appendTo($('body'));

                el.data('selector', self.$selector);
                self.$selector.data('input', el);
                self._createList($this.val());
            } else {
                self._createList($this.val());
            }
        },
        _createList: function() {
            var self = this,
                $selector = self.$selector,
                $ul = $('<ul />', {
                'class': 'loading-bar'
            });
            $ul.appendTo(self.$selector);
            self._getResults();
        },
        _getResults: function() {
            var self = this,
                val = self.$el.val();

            if (!$.isArray(self.defaults.remote)) {
                $.ajax({
                    url: self.defaults.remote + '?term=' + val,
                    type: 'get',
                    dataType: 'json',
                    success: function(response) {
                        if (response) {
                            var data = response;
                            self._create_selector(data);
                        } else {
                            self.$selector.find('ul').remove();
                        }
                    }
                })
            } else if ($.isArray(self.defaults.remote)) {
                var multipleSearchWords = val.split(" "),
                    regex = "",
                    result = [];

                for (i = 0; i < multipleSearchWords.length; i++) {
                    regex += multipleSearchWords[i];
                    if (i < multipleSearchWords.length - 1) {
                        regex += ".*?";
                    }
                }
                result = $.map(self.defaults.remote, function(value) {
                    var search = new RegExp(regex, "gi");
                    if (value.text.match(search)) {
                        return value;
                    }
                    return null;
                });
                self._create_selector(result);
            }
        },
        _create_selector: function(data) {
            var self = this,
                val = self.$el.val(),
                $selector = self.$selector;
            this.$container = this.$el.parent();
            $selector.find('ul').remove();
            var $ul = $('<ul />', {
                'class': 'selection-list'
            });

            $.each(data, function(index, values) {
                var $li = $('<li />', {
                        'class': 'list-tag',
                        'data-id': values.id
                    })
                    .text(values.text)
                    .data('index', values.id)
                    .on('click', function(event) {
                        $that = $(this);
                        $(this).addClass('selected')
                        var tagId = $that.data('index');
                        var tagName = $that.text();
                        var checktagid = true;

                        var $input = $that.parents('.text-selector').data('input');
                        var $container_div = $input.parents('.tag-container');

                        var existingindex = $container_div.find(".tag-row span.tag-text");
                        existingindex.each(function() {
                            if (tagId == $(this).data('tagid')) {
                                checktagid = false;
                            }
                        });

                        if (checktagid) {
                            self.defaults.selected.push(tagId);
                            var $tagDelete = $('<span />', {
                                    class: 'tag-delete'
                                })
                                .html(self.defaults.deleteIconHtml)
                                .on('click', function(event) {
                                    event.preventDefault();
                                    var $parentRow = $(this).parents('.tag-row:first');
                                    var val = $parentRow.find('.tag-text').data('tagid');
                                    $parentRow.remove();
                                    self.defaults.selected = jQuery.grep(self.defaults.selected, function(value) {
                                        return value != val;
                                    })
                                    self._adjust_input();
                                    self.defaults.onSelect.call(self, self.defaults.selected);
                                })
                            var $tagTitle = $('<span />', {
                                    class: 'tag-text'
                                })
                                .data({
                                    tagid: tagId
                                })
                                .text(tagName);
                            var $tagRow = $('<div />', {
                                class: 'tag-row'
                            });
                            $tagRow.append($tagTitle).append($tagDelete);
                            $tagRow.insertBefore(self.$el);

                            self._adjust_selector();
                            self._adjust_input();
                            self.defaults.onSelect.call(self, self.defaults.selected);
                        }
                    })
                $li.appendTo($ul);
            });

            $ul.appendTo(self.$selector);

            self.$selector.slideDown(500, function() {
                if (self.defaults.showSelected) {
                    if (self.defaults.showSelectedDisabled) {
                        if ($.isArray(self.defaults.selected) && self.defaults.selected.length > 0) {
                            var $preSelectedLi = $("li.list-tag", $(this)).filter(function() {
                                return $.inArray($(this).data("index"), self.defaults.selected) !== -1;
                            })
                            $preSelectedLi.addClass('selected');
                        }
                    }
                } else {
                    if ($.isArray(self.defaults.selected) && self.defaults.selected.length > 0) {
                        var $preSelectedLi = $("li.list-tag", $(this)).filter(function() {
                            return $.inArray($(this).data("index"), self.defaults.selected) !== -1;
                        })
                        $preSelectedLi.remove();
                    }
                }
            });
            if($ul.find('li').length <= 0){
                self.$selector.hide();
            }
        },
        _add_preselected: function(){
            var self = this,
                preselected = self.defaults.preselected;

            if(preselected) {
                $.each(preselected, function(index, el) {

                    var tagId = el.id || '',
                        tagName = el.text || '';

                    self.defaults.selected.push(tagId);
                    var $tagDelete = $('<span />', {
                            class: 'tag-delete'
                        })
                        .html(self.defaults.deleteIconHtml)
                        .on('click', function(event) {
                            event.preventDefault();
                            var $parentRow = $(this).parents('.tag-row:first');
                            var val = $parentRow.find('.tag-text').data('tagid');
                            $parentRow.remove();
                            self.defaults.selected = jQuery.grep(self.defaults.selected, function(value) {
                                return value != val;
                            })
                            self._adjust_input();
                            self.defaults.onSelect.call(self, self.defaults.selected);
                        })
                    var $tagTitle = $('<span />', {
                            class: 'tag-text'
                        })
                        .data({
                            tagid: tagId
                        })
                        .text(tagName);
                    var $tagRow = $('<div />', {
                        class: 'tag-row'
                    });
                    $tagRow.append($tagTitle).append($tagDelete);
                    $tagRow.insertBefore(self.$el);
                });
            }
        },
        _adjust_selector: function() {
            var dfd = $.Deferred();
            var $this = this.$container,
                coordinates = $this.offset(),
                $box_wrapper = this.$selector

            var css = {
                left: coordinates.left - ($box_wrapper.width() / 2) + ($this.outerWidth() / 2),
                top: coordinates.top + $this.outerHeight() + 10,
                right: 'auto'
            };
            this.$selector.css(css);

            dfd.resolve();
            return dfd.promise();
        },
        _adjust_input: function() {
            var $container = this.$container,
                container_width = $container.innerWidth();
            var wid = 0;
            $('.tag-row', $container).each(function(index, el) {
                wid += $(this).width();
            });
            var input_width = container_width - wid - 130;
            this.$el.css('width', input_width + 'px');
        },
        _hideSelector: function() {
            var self = this;
            var el = self.$el;

            $(document).on('click', function(e) {
                el.each(function() {
                    var $this = $(this);
                    var $selector = self.$selector;
                    if ($selector) {
                        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $selector.has(e.target).length === 0) {
                            if ($selector) {
                                $selector.slideUp(300, function() {
                                    $(this).remove();
                                    $this.val('').removeClass(self.isOpen);
                                });
                            }
                        }
                    }
                });
            });
        },
        init: function() {
            this._init.call(this, this.$el, this.defaults);
        },
        set: function(key, value) {
            this.defaults[key] = value;
            this.init();
        },
        get_tags: function() {
            console.log('test', this.defaults.selected);
        }
    }

    $.fn.tagText = function(options) {
        if ($.isPlainObject(options)) {
            return this.each(function() {
                var tagText = Object.create(TAG_TEXT);
                tagText._init(this, options);
                $(this).data('tagText', tagText);
            });
        } else if (typeof options === 'string' && options.indexOf('_') !== 0) {
            var tagText = $(this).data('tagText');
            var method = tagText[options];
            return method.apply(tagText, $.makeArray(arguments).slice(1));
        } else {
            return this.each(function() {
                var tagText = Object.create(TAG_TEXT);
                tagText._init(this, $.fn.tagText.defaults);
                $(this).data('tagText', tagText);
            });
        }
    };

    $.fn.tagText.defaults = {
        autoHeight: true, // if you want to set the below maximum height for the container
        maxHeight: 100, // digits/string
        duration: 100, // dropdown show/hide duration
        theme: 'yellow', // container/dropdown color theme
        showSelected: false, // show/hide already selected values
        showSelectedDisabled: true, // show disabled to already selected values
        remote: false, // array of objects[{'id': 1, 'text': 'Test 1'},{'id': 2, 'text': 'Test 2'}] / valid url
        preselected: false, // array of objects of pre selected values
        deleteIconHtml: '&#x2715;',
        onSelect: function() {return true;},
    };

})(jQuery, window, document);