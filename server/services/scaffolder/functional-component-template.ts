import outdent from "outdent";

function functionalComponentTemplate(name: string) {
  return outdent`
    import React from 'react';
    export default function ${name}() {
        return <div></div>
    }
    `;
}
export default functionalComponentTemplate;
