console.log("hello world.");

function getEmailContent(){
    const selectors=[
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const element of selectors) {
        const content=document.querySelector(element);
        if(content) return content.textContent.trim();
    }
    return "";
}

function findToolBar(){
    const selectors=[
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const element of selectors) {
        const toolbar=document.querySelector(element);
        if(toolbar) return toolbar;
    }
}
function createAIButton(){
    const button=document.createElement("div");
    button.className='T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight="8px";
    button.innerHTML="Reply with AI";
    button.setAttribute("role", "button");
    button.setAttribute("data-tooltip", "Generate email with AI");
    return button;
}
const injectButton=()=>{
    const aiButton=document.querySelector(".ai-button");
    if(aiButton) aiButton.remove();

    const toolBar=findToolBar();
    if(!toolBar){
        console.log("Toolbar not found.");
        return;
    }
    console.log("Toolbar found.");
    const button=createAIButton();
    button.classList.add("ai-button");
    button.addEventListener("click", async()=>{
        try {
            button.innerHTML="Generating...";
            button.disabled=true;
            const emailContent=getEmailContent();

            const response=await fetch("http://localhost:8080/api/email/generate", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    "emailContent": emailContent,
                    "tone": "professional"
                })
            });
            if(!response.ok){
                throw new Error("Error generating content.");
            }

            const generatedReply=await response.text();
            console.log(generatedReply);
            
            const composeBox=document.querySelector('[role="textbox"][g_editable="true"]');

            if(composeBox){
                composeBox.focus();
                document.execCommand("insertText", false, generatedReply);
            }
            else throw new Error("Compose box not found.");

        } catch (error) {
            throw new Error("Error generating the response.");
        }finally{
            button.innerHTML="Reply with AI";
            button.disabled=false;
        }
    })
    toolBar.insertBefore(button, toolBar.firstChild);
    
}

const observer=new MutationObserver((mutations)=>{
    for(const mutation of mutations){
        const addedNodes=Array.from(mutation.addedNodes);
        const hasComposeElements=addedNodes.some(node => 
            node.nodeType===Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );
        if(hasComposeElements){
            console.log("Compose window detected.");
            setTimeout(injectButton, 500);
            
        }
        
    }
})
observer.observe(document.body, {
    subtree: true,
    childList: true
})