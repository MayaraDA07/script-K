function closeModal(){
    const button = document.createElement("button");

    button.setAttribute("style",`
        position: absolute;
        color: white;
        right: 0%;
        top: 0%;
        background: #9a3e99;
        border: none;
        border-radius: 15px;
        transform: translateY(-15px);
        width: 30px;
        height: 30px;
        text-align: center;
    `);
    button.innerHTML = "x";

    button.addEventListener("click",(evt)=>{
        console.log(button.parentElement);
        button.parentElement.style.transform = "scale(10%)";
        button.parentElement.style.opacity = "0%"
    });

    return button;
}

function initial(){
    const modal = document.createElement("div");

    const title = document.createElement("p");
    title.setAttribute('style',`
        font-size: 2rem;
        font-weight: bold;
        color: white;
        margin-right: 10px;
        display: inline;
    `);

    const catText = document.createElement("p");
    catText.innerHTML = "ᓚᘏᗢ";
    catText.style.color = "#9a3e99";
    catText.style.fontSize = "2rem";
    catText.style.display = "inline";

    title.innerHTML = "Script injetado";

    modal.style.width = "350px";
    // modal.style.height = "90px";

    modal.style.backgroundColor = "black";
    modal.style.position = "absolute";
    modal.style.left = "50%";
    modal.style.top = "0%";
    modal.style.transform = "translate(-50%, 50%)";
    modal.style.padding = "15px";
    modal.style.borderRadius = "0.75rem";
    //modal.style.display = "flex";
    modal.style.border = "solid 3px #9a3e99"
    modal.style.transition = "all 0.3s ease";
    const message = document.createElement("p");
    message.innerHTML = "Após injetar o script, não atualize a página até que você termine. Caso contrário, será necessário injetar o script novamente. A partir de agora, você pode responder a qualquer pergunta, mas lembre-se de esperar cerca de 1 a 2 segundos para cada questão! Isso evitará erros. Enjoy \n R6";
    message.style.color = "white";
    message.style.position = "relative";
    
    modal.appendChild(title);
    modal.appendChild(catText);
    modal.appendChild(message);
    modal.appendChild(closeModal());

    return modal;
}

(function () {
    'use strict';
    console.log("%crodando...", 'color:red; font-size:35px');
    document.body.appendChild(initial());

    const originalFetch = window.fetch;

    let data = null;
    let finalRes = {};

    window.fetch = async function (...args) {

        let res = await originalFetch(...args); // Chama o fetch original
        //console.log(res);
        const url = res.url.split("/");
        // console.log(url);
        const newUrl = url[url.length - 1].split("?");
        if (newUrl[0] === "getAssessmentItem") {
            //console.log(newUrl);
            data = res.clone();
            const resBody = await data.clone().text();
            const obj = JSON.parse(resBody);;
            //console.log("response", res)
            try {
                const newData = await data.json();
                const items = JSON.parse(newData.data.assessmentItem.item.itemData);

                const radio = {
                    alignment: "default",
                    graded: true,
                    options: {
                        choices: [
                            {
                                content: "correto",
                                correct: true
                            },
                            {
                                content: "incorreto",
                                correct: false
                            },
                        ],
                        countChoices: false,
                        deselectEnabled: false,
                        displayCount: null,
                        hasNoneOfTheAbove: false,
                        hasNoneOfTheAbove: false,
                        randomize: true
                    },
                    static: false,
                    type: "radio",
                    version: { major: 1, minor: 0 }
                }

                items.answerArea = {
                    calculator: false,
                    chi2Table: false,
                    periodicTable: false,
                    tTable: false,
                    zTable: false,
                }


                items.question.widgets = { ["radio 3"]: radio };
                newData.data.assessmentItem.item.itemData = JSON.stringify(items);
                
                const teste = JSON.parse(newData.data.assessmentItem.item.itemData);
                console.log(items);
                finalRes = newData;
                const editRes = new Response(JSON.stringify(finalRes), {
                    status: res.status,
                    statusText: res.statusText,
                    headers: res.headers,
                });
                //teste.question.widgets = {["radio 1"]:radio};

                res = editRes
            } catch (error) {
                console.error("type não encontrado ou falha na busca", error);
            }
        }
        // Aqui você verá "Resposta" e os detalhes da resposta
        return res; // Retorna a resposta como o fetch original faria
    };
})();

