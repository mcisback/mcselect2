export class MCSelect2 {
    constructor() {
        this.$el = null
        this.isToggled = false
        this.selectedOption = null
    }

    insertAfter(newElement, referenceElement) {
        referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
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
        $select2Display.id = 'mcselect2Display';
        $select2Display.setAttribute('class', 'mcselect2--select-display');

        $select2Display.innerHTML = `<div>${this.$el.value}</div><div class="arrow">&gt;</div>`;

        $select2Display.onclick = (ev) => {
            this.isToggled = !this.isToggled

            $select2Div.style.display = this.isToggled ? 'block' : 'none';
        }

        $wrapper.appendChild($select2Display);

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

                this.selectOption(optionValue)
            }
            
            if(isOptionSelected) {
                this.selectOption(optionValue)
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

    selectOption(optionValue) {
        this.$el.value = optionValue
        this.selectedOption = optionValue
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
