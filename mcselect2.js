class MCSelect2 {
    constructor() {
        this.$el = null
        this.isToggled = false
        this.selectedOption = {
            text: '',
            value: '',
            $el: {}
        }
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

    insertAfter(newElement, referenceElement) {
        referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
    }
    
    toggle() {
        this.isToggled = !this.isToggled

        document.getElementById('mcselect2div').style.display = this.isToggled ? 'block' : 'none';

        this.changeArrow()
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

        if($el.tagName.toLowerCase() !== 'select') {
            throw new Error(selector + ' must be a select element')
        }

        $el.style.position = 'relative';

        let $wrapper = document.createElement('div')
        $wrapper.id = 'mcselect2wrapper';
        $wrapper.setAttribute('class', 'mcselect2--wrapper');

        let $select2Div = document.createElement('div')
        $select2Div.id = 'mcselect2div';
        $select2Div.setAttribute('class', 'mcselect2--select');

        let $select2Display = document.createElement('div')
        this.$select2Display = $select2Display
        $select2Display.id = 'mcselect2Display';
        $select2Display.setAttribute('class', 'mcselect2--select-display');

        $select2Display.onclick = (ev) => {
            this.toggle()
        }

        $wrapper.appendChild($select2Display);

        this.changeSelectDisplay();

        let $select2Input = document.createElement('input')
        $select2Input.type = 'text';
        $select2Input.setAttribute('class', 'mcselect2--input');
        $select2Input.name = 'mcselect2input';
        $select2Input.id = 'mcselect2input';

        $select2Input.oninput = this.search
        $select2Input.onpaste = this.search
        $select2Input.onchange = this.search

        $select2Div.appendChild($select2Input)

        let $optionsContainer = document.createElement('div')
        $optionsContainer.setAttribute('class', 'mcselect2--options-container')

        Array.from($el.options).forEach(($option) => {
            let optionText = $option.text;
            let optionValue = $option.value;
            let isOptionSelected = $option.selected;

            let $optionDiv = document.createElement('div')
            $optionDiv.setAttribute('class', 'mcselect2--option')

            $optionDiv.dataset.value = optionValue;
            $optionDiv.dataset.content = this.sanitizeOption(optionText);
            $optionDiv.innerHTML = optionText;

            $optionDiv.onclick = (ev) => {
                console.log('Option Text: ', ev.target.innerHTML)
                console.log('Option Value: ', ev.target.dataset.value)

                this.selectOption(ev.target)
                this.changeSelectDisplay()
                this.toggle()
            }
            
            if(isOptionSelected) {
                this.selectOption($optionDiv)
                this.changeSelectDisplay()
            }
            
            $optionsContainer.appendChild($optionDiv)
        });

        $select2Div.appendChild($optionsContainer)

        this.insertAfter($wrapper, $el)

        $wrapper.appendChild($el)
        $wrapper.appendChild($select2Div)

        $select2Div.style.top = $select2Display.offsetHeight + 'px';

        $el.style.top = '-9999px';
        $el.style.left = '-9999px';
        $el.style.zIndex = '-1';
    }

    selectOption($option) {
        let optionText = $option.textContent;
        let optionValue = $option.dataset.value;

        this.$el.value = optionValue
        this.selectedOption = {
            $el: $option,
            text: optionText, 
            value: optionValue
        }
    }

    search(ev) {
        let $search = ev.target.value

        console.log('You Wrote: ', $search)

        if($search === '') {
            Array.from(document.querySelectorAll(`div.mcselect2--option`)).forEach(($option) => {
                $option.style.display = 'block';
            })
        }
        
        Array.from(document.querySelectorAll(`div.mcselect2--option`)).forEach(($option) => {
            $option.style.display = 'none';

            if($option.dataset.content.includes($search)) {
                console.log('$option.dataset.content.includes: ', $option.dataset.content, $search)
                $option.style.display = 'block';
            }
        })
    }

    sanitizeOption(text) {
        /* console.log('Text: ', text,text.toLowerCase()
            .replace(/[\u{0080}-\u{10FFFF}]/gu,"")
            .replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '')
            .replace(/\s/g, '_')) */

        return text.toLowerCase()
            .replace(/[\u{0080}-\u{10FFFF}]/gu,"")
            .replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '')
    }
}
