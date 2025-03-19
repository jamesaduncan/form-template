import SelectorSubscriber from "https://jamesaduncan.github.io/selector-subscriber/index.mjs";

SelectorSubscriber.subscribe("form[template]", ( aForm ) => {
    aForm.addEventListener('submit', async ( theEvent ) => {
        const formdata    = new FormData( theEvent.target );
        const destination = document.querySelector( theEvent.target.getAttribute('action') );
        const template    = document.querySelector( theEvent.target.getAttribute('template') );

        const clone = template.content.cloneNode( true );
        Array.from( formdata.keys() ).forEach( (key) => {
            try {
                clone.querySelector(`slot[name=${key}]`).replaceWith( document.createTextNode( formdata.get( key ) ) );
            } catch(e) {
                console.warn(e);
            }
        });

        theEvent.preventDefault();
        destination[ theEvent.target.getAttribute('mutation') || "appendChild" ]( clone );
    });
});
