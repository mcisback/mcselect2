class MCSelect2 {
    constructor(opts) {
        this.$el = null
        this.isToggled = false
        this.selectedOption = {
            text: '',
            value: '',
            $el: {}
        }

        this.uuid = this.uuidv4();

        const defaultOpts = {
            source: 'select',
            name: 'mcselect2value',
            id: 'mcselect2hidden',
            isAsync: false,
            hideOriginalSelect: true,
            debug: false,
            onOptionSelected: null,
            onToggle: null,
            onTyping: null,
            processRow: ($option) => { 
                return {   
                    optionValue: $option.value,
                    optionText: $option.text,
                    isOptionSelected: $option.selected
                }
            },
        }

        this.opts = Object.assign({}, defaultOpts, opts)

        this.arrow = {
            right: `<?xml version="1.0" encoding="iso-8859-1"?>
            <!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
            <svg width=16 height=16 version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 492.004 492.004" style="enable-background:new 0 0 492.004 492.004;" xml:space="preserve">
                <g>
                    <g>
                        <path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
                            c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
                            c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
                            c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"/>
                    </g>
                </g>
            </svg>
            `,

            down: `<?xml version="1.0" encoding="iso-8859-1"?>
            <!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
            <svg width=16 height=16 version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 256 256" style="enable-background:new 0 0 256 256;" xml:space="preserve">
                <g>
                    <g>
                        <polygon points="225.813,48.907 128,146.72 30.187,48.907 0,79.093 128,207.093 256,79.093"/>
                    </g>
                </g>
            </svg>
            `
        };
    }

    uuidv4() {
        return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    log(...params) {
        if(this.opts.debug) {
            console.log(...params)
        }
    }

    insertAfter(newElement, referenceElement) {
        referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
    }
    
    toggle() {
        this.isToggled = !this.isToggled

        document.getElementById('mcselect2div-' + this.uuid).style.display = this.isToggled ? 'block' : 'none';

        this.changeArrow()

        this.createCustomEvent("mcselect2-toggled", {
            isToggled: this.isToggled
        })

        if(this.isFunction(this.opts.onToggle)) {
            this.opts.onToggle({
                isToggled: this.isToggled
            })
        }
    }

    createCustomEvent(name, data) {
        this.getElementBySource().dispatchEvent(new CustomEvent(name, { 
            detail: data
        }));
    }

    dispatchEvent(name) {
        if(this.opts.source === 'select') {
            this.$el.dispatchEvent(new Event(name));
        } else {
            this.$hiddenOption.dispatchEvent(new Event(name));
        }
    }

    addEventListener(...params) {
        return this.getElementBySource().addEventListener(...params);
    }

    changeSelectDisplay() {
        let display = this.selectedOption.text === '' ? 'Select' : this.selectedOption.text;
        let arrow = this.isToggled ? 'down' : 'right';
        this.$select2Display.innerHTML = `<div>${display}</div><div class="arrow">${this.arrow[arrow]}</div>`;
    }

    changeArrow() {
        let arrow = this.isToggled ? 'down' : 'right';
        this.$select2Display.querySelector('.arrow').innerHTML = this.arrow[arrow];
    }

    attach(selector) {
        let $el = document.querySelector(selector)
        this.$el = $el

        if(!$el) {
            throw new Error('MCSelect2 selector is wrong')
        }

        if($el.tagName.toLowerCase() !== 'select' && this.opts.source === 'select') {
            throw new Error(selector + ' must be a select element if source is select')
        }

        let $wrapper = document.createElement('div')
        this.$wrapper = $wrapper
        $wrapper.id = 'mcselect2wrapper-' + this.uuid;
        $wrapper.classList.add('mcselect2--wrapper');

        let $select2Div = document.createElement('div')
        $select2Div.id = 'mcselect2div-' + this.uuid;
        $select2Div.classList.add('mcselect2--select');

        let $select2Display = document.createElement('div')
        this.$select2Display = $select2Display
        $select2Display.id = 'mcselect2Display-' + this.uuid;
        $select2Display.classList.add('mcselect2--select-display');
        
        if(this.opts.selectBackground) {
            $select2Display.style.background = this.opts.selectBackground;
        }

        if(this.opts.selectColor) {
            $select2Display.style.color = this.opts.selectColor;
        }

        $select2Display.onclick = (ev) => {
            this.toggle()
        }

        $wrapper.appendChild($select2Display);

        this.changeSelectDisplay();

        let $select2Input = document.createElement('input')
        $select2Input.type = 'text';
        $select2Input.classList.add('mcselect2--input');
        $select2Input.name = 'mcselect2input';
        $select2Input.id = 'mcselect2input-' + this.uuid;

        $select2Input.oninput = this.search.bind(this)
        $select2Input.onpaste = this.search.bind(this)
        $select2Input.onchange = this.search.bind(this)

        $select2Div.appendChild($select2Input)

        let $optionsContainer = document.createElement('div')
        this.$optionsContainer = $optionsContainer
        $optionsContainer.classList.add('mcselect2--options-container')

        this.data = []

        if(this.opts.source === 'select') {
            this.data = $el.options
        } else {
            this.$hiddenOption = document.createElement('input');
            this.$hiddenOption.type = 'hidden';
            
            if(!this.opts.name || this.opts.name === '') {
                throw new Error('Missing name for mcselect2 input select')
            }
            
            this.$hiddenOption.name = this.opts.name

            if(this.opts.id) {
                this.$hiddenOption.id = this.opts.id
            }

            $wrapper.appendChild(this.$hiddenOption)
            
            if(!this.isFunction(this.opts.data)) {
                throw new Error('data must be a function returning values');
            }

            if(this.opts.isAsync) {
                this.log('Async Function');

                Promise.all([
                    this.opts.data()
                ]).then($data => this.setData($data))
            } else {
                this.data = this.opts.data()
            }
        }

        this.log('data: ', this.data);

        this.renderRows();

        $select2Div.appendChild($optionsContainer)

        this.insertAfter($wrapper, $el)

        $wrapper.appendChild($el)
        $wrapper.appendChild($select2Div)

        $select2Div.style.top = $select2Display.offsetHeight + 'px';

        if(this.opts.hideOriginalSelect) {
            $el.style.position = 'absolute';
            $el.style.top = '-9999px';
            $el.style.left = '-9999px';
            $el.style.zIndex = '-1';   
        }
    }

    renderRows() {
        Array.from(this.data).forEach(($option) => {
            this.renderRow($option);
        });
    }

    renderRow($option) {
        this.log('$option: ', $option);

        if(!this.isFunction(this.opts.processRow)) {
            throw new Error('processRow is not a function')
        }

        const { optionValue, optionText, isOptionSelected } = this.opts.processRow($option)

        let $optionDiv = document.createElement('div')
        $optionDiv.classList.add('mcselect2--option')

        $optionDiv.dataset.value = optionValue;
        $optionDiv.dataset.content = this.sanitizeOption(optionText);
        $optionDiv.innerHTML = optionText;

        $optionDiv.onclick = (ev) => {
            this.log('Option Text: ', ev.target.innerHTML)
            this.log('Option Value: ', ev.target.dataset.value)

            this.selectOption(ev.target)
            this.changeSelectDisplay()
            this.toggle()
        }
        
        if(isOptionSelected) {
            this.selectOption($optionDiv)
            this.changeSelectDisplay()
        }
        
        this.$optionsContainer.appendChild($optionDiv)
    }

    refresh() {
        Array.from(document.querySelectorAll(`div.mcselect2--option`)).forEach(($option) => {
            $option.parentNode.removeChild($option);
        });

        this.renderRows();
    }

    setData(data) {
        this.data = data;
    }

    getElementBySource() {
        return this.opts.source === 'select' ? this.$el : this.$hiddenOption;
    }

    setFormInputValue(value) {
        if(this.opts.source === 'select') {
            this.$el.value = value
        } else {
            this.$hiddenOption.value = value
        }
    }

    getFormInputValue() {
        return this.getElementBySource().value;
    }

    selectOption($option) {
        let optionText = $option.textContent;
        let optionValue = $option.dataset.value;

        this.setFormInputValue(optionValue)

        this.selectedOption = {
            $el: $option,
            text: optionText, 
            value: optionValue
        }

        this.dispatchEvent('change');
        this.createCustomEvent("mcselect2-option-selected", {
            selectedOption: this.selectedOption
        })

        if(this.isFunction(this.opts.onOptionSelected)) {
            this.opts.onOptionSelected({
                selectedOption: this.selectedOption
            })
        }

        this.log('$el.text: ', optionText)
        this.log('$el.value: ', this.getFormInputValue())
    }

    isFunction(v) {
        return v && typeof v === 'function'
    }

    search(ev) {
        const $query = ev.target.value

        this.log('You Wrote: ', $query)

        this.createCustomEvent('mcselect2-on-typing', {
            query: $query,
            target: ev.target
        });

        if(this.isFunction(this.opts.onTyping)) {
            const returnValue = this.opts.onTyping({
                query: $query,
                target: ev.target
            })

            if(returnValue === false) {
                return;
            }
        }

        if($query === '') {
            Array.from(document.querySelectorAll(`div.mcselect2--option`)).forEach(($option) => {
                $option.style.display = 'block';
            })
        }
        
        Array.from(document.querySelectorAll(`div.mcselect2--option`)).forEach(($option) => {
            $option.style.display = 'none';

            if($option.dataset.content.includes($query)) {
                this.log('$option.dataset.content.includes: ', $option.dataset.content, $query)
                $option.style.display = 'block';
            }
        })
    }

    sanitizeOption(text) {
        /* this.log('Text: ', text,text.toLowerCase()
            .replace(/[\u{0080}-\u{10FFFF}]/gu,"")
            .replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '')
            .replace(/\s/g, '_')) */

        if(this.isFunction(this.opts.sanitizeOption)) {
            return this.opts.sanitizeOption(text);
        } else {
            return text.toLowerCase()
                .replace(/[\u{0080}-\u{10FFFF}]/gu,"")
                .replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '')
        }
    }
}
