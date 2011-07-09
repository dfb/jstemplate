/* Client-side templating utility - Dave Brueck (dave at protoven dot com)
Goal is to express layout in pure HTML and have it be maintainable by a designer throughout
the life of the project, not just at the beginning.

To make an object be templatable, give it a template="<name>" attribute. If you have e.g. a list
of items, you'd make a template out of the <li> element and then instantiate it over and over again.
For preview purposes, you'd put tosskids="true" in the <ul> element - this tells it that all of
the non-template child nodes are there purely for preview purposes.

If Knockout.js is present, installs itself as a Knockout template engine.
Depends on jQuery.
*/

Template = {
    // id if invisible div that holds all our cloneable objects
    containerID : '__templateContainer',
    container : null,

    // Should be called after page loads in a non-preview mode - creates the
    // template source area and moves templatable objects into it. Also removes any
    // objects that exist solely for preview purposes.
    Setup : function()
    {
        // create an area to hold template objects
        Template.container = $('<div style="display:none" id="' + Template.containerID + '"></div>');
        $('body').append(Template.container);

        // move any root objs into the template container
        Template.container.append($('[template]').detach());

        // remove any children that exist just for preview purposes
        $('[tosskids=true]').children().remove();

        // if Knockout is present, register a new template engine for it
        if (window.ko)
        {
            var engine = function ()
            {
                this.renderTemplate = function (templateId, data, options)
                {
                    var x = Template.Create(templateId);
                     ko.applyBindings(data, x.get(0));
                     return x;
                };
                this.rewriteTemplate = function (template, rewriterCallback) { return; }
                this.isTemplateRewritten = function (templateId) { return true; }
            };

            engine.prototype = new ko.templateEngine();
            ko.setTemplateEngine(new engine());
        }
    },

    // returns an instance of the object with the given template name
    Create : function(name)
    {
        var template = $('#' + Template.containerID + ' [template='+ name +']');
        if (!template)
            console.log('ERROR: no such template', name);
        else
        {
            var obj = $($.clone(template.get(0)));
            obj.removeAttr('template');
            return obj;
        }
    }
}

