import SelectorSubscriber from "https://jamesaduncan.github.io/selector-subscriber/index.mjs";

SelectorSubscriber.subscribe("form[template]", ( aForm ) => {
    aForm.addEventListener('submit', async ( theEvent ) => {
        theEvent.preventDefault();
        const formdata    = new FormData( theEvent.target );
        const destination = document.querySelector( theEvent.target.getAttribute('action') );
        const template    = document.querySelector( theEvent.target.getAttribute('template') );

        const clone = template.content.cloneNode( true );
        Array.from( formdata.keys() ).forEach( (key) => {
            try {
                const node = clone.querySelector(`slot[name=${key}]`);
                if ( node ) {
                    node.replaceWith( document.createTextNode( formdata.get( key ) ) );
                } else {
                    const node = clone.querySelector(`[itemprop=${key}]`);
                    if ( node ) {
                        node.innerHTML = formdata.get( key );
                    } else {
                        console.warn(`No slot or itemprop found for ${key}`);
                    }
                }
            } catch(e) {
                console.warn(e);
            }
        });

        const method = theEvent.target.getAttribute('method').toLowerCase() || 'post';
        if ( method === 'put' ) {
            destination.replaceWith( clone );
            if ( clone.PUT ) clone.PUT();
        } else if ( method === 'post' ) {
            destination.appendChild( clone );
            if ( destination.POST ) destination.POST( formdata, clone )
        }

//        destination[ theEvent.target.getAttribute('mutation') || "appendChild" ]( clone );

        if ( theEvent.target.hasAttribute('reset') && theEvent.target.getAttribute('reset') ) theEvent.target.reset();


    });
});
