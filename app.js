'use strict'

/*---------------------------------------MODEL-----------------------------------------------------*/

let Model = (function(){
    let userMessage = [];
    let botResponse = [];

    let getUserNick = function(nickValue){
        this.botName = 'ALISA';
        this.userNick = nickValue;

        this.intervalOfReqwest = 4000;

    }

    let getUserMessage = function(messageValue){
        this.userMessage = userMessage;
        this.userMessage.push(messageValue);


    }

    let getDateMessage = function(date) {
        this.dateMessage = date;
    }

    let getBotResponse = function(response) {
        this.botResponse = botResponse;
        this.botResponse.push(response);
    }

    return {
        getUserNick:getUserNick,
        getUserMessage:getUserMessage,
        getDateMessage:getDateMessage,
        getBotResponse:getBotResponse
    }

})();

/*------------------------------------------VIEW------------------------------------------------------*/

let View = (function(){
   const fieldEnterNickName = document.querySelector('.fieldEnterNickName');
   const messageField = document.querySelector('.messageField');
   const containerForMessage = document.querySelector('.containerForMessage');
   const statusMessage = document.querySelector('.statusMessage');

    let hideNickFieldAndShowMessageField = function () {
        if (Model.userNick !== '') {
            fieldEnterNickName.style.display = 'none';
            messageField.style.display = 'block';
        } else {
            alert('Please, input nick-name !');
        };
    }

    let renderMessage = function (divCounter,whoIs) {
        let divWrapper = [];
        let divUserMessage = [];
        let buttonDeleteUserMessage = [];
        let spanUserMessageDate = [];
        let userNick = [];
        let nickName = [];

        divWrapper[divCounter] = document.createElement('div');
        divWrapper[divCounter].style.cssText = 'width: 100%; height:50px; margin-top: 10px;';
        containerForMessage.appendChild(divWrapper[divCounter]);

        divUserMessage[divCounter] = document.createElement('div');

        divWrapper[divCounter].appendChild(divUserMessage[divCounter]);

        buttonDeleteUserMessage[divCounter] = document.createElement('p');
        buttonDeleteUserMessage[divCounter].innerHTML = 'X';
        buttonDeleteUserMessage[divCounter].setAttribute('title','delete message');
        buttonDeleteUserMessage[divCounter].style.cssText = 'float: right; color: red; margin-left:3px; margin-top:3px; cursor: pointer; font-size: 24px';

        Controller.addListenerToRemoveMessage(buttonDeleteUserMessage[divCounter]);

        spanUserMessageDate[divCounter] = document.createElement('p');
        spanUserMessageDate[divCounter].style.cssText = 'float:right; ';

        spanUserMessageDate[divCounter].innerHTML = Model.dateMessage;

        userNick[divCounter] = document.createElement('div');

        divWrapper[divCounter].appendChild(userNick[divCounter]);

        nickName[divCounter] = document.createElement('p');

        userNick[divCounter].appendChild(nickName[divCounter]);

        if (whoIs=='user') {
            divUserMessage[divCounter].style.cssText = 'width: 50%;  height:30px; border-radius: 10px; margin-left: 45%; opacity:1; padding: 5px; background-color: #FFE4B5; margin-top: 2px; overflow: auto;';
            divUserMessage[divCounter].className = 'animationMessageUser';
            divUserMessage[divCounter].innerHTML = Model.userMessage[divCounter-1];
            divUserMessage[divCounter].appendChild(buttonDeleteUserMessage[divCounter]);
            divUserMessage[divCounter].appendChild(spanUserMessageDate[divCounter]);

            userNick[divCounter].style.cssText = 'width: 130px; height:20px; background-color:#FFE4B5; color:#FF6347; opacity:1; position:relative; left:37%; border-radius:10px; text-align: center;';
            userNick[divCounter].className = 'animationMessageUser';
            userNick[divCounter].innerHTML = Model.userNick;
        } else {
            divUserMessage[divCounter].style.cssText = 'width: 50%; margin-left: 8%; height:30px; border-radius: 10px; padding: 5px; background-color: #AFEEEE; opacity:1; margin-top: 1px; overflow: auto';
            divUserMessage[divCounter].className = 'animationMessageBot';
            divUserMessage[divCounter].innerHTML = Model.botResponse[divCounter-1];
            divUserMessage[divCounter].appendChild(buttonDeleteUserMessage[divCounter]);
            divUserMessage[divCounter].appendChild(spanUserMessageDate[divCounter]);

            userNick[divCounter].style.cssText = 'width: 130px; height:20px; background-color:#AFEEEE; color:#FF6347; position:relative; left:1%; border-radius:10px; opacity:1; text-align: center';
            userNick[divCounter].className = 'animationMessageBot';
            userNick[divCounter].innerHTML = Model.botName;

            renderStatusMessage(false,'bot')
        }

    }

    let cleanMessageField = function(messageField){
        messageField.innerHTML = '';
    }

    let removeMessage = function() {
        let removeElement = this.parentNode.parentNode;
        removeElement.remove();
    }

    let renderStatusMessage = function(flag,whoIs) {
        if (flag) {
            statusMessage.style.display = 'block';
            if(whoIs == 'user') {
                statusMessage.innerHTML = `${Model.userNick} печатает...`
            } else {
                statusMessage.innerHTML = `${Model.botName} печатает...`
            };
        } else {
            statusMessage.style.display = 'none';
        };
    }

    return {
        hideNickFieldAndShowMessageField:hideNickFieldAndShowMessageField,
        renderMessage:renderMessage,
        cleanMessageField:cleanMessageField,
        removeMessage:removeMessage,
        renderStatusMessage:renderStatusMessage
    }

})();

/*------------------------------------------CONTROLLER--------------------------------------------------------*/

let Controller = (function() {
    const inputNickName = document.querySelector('.inputNickName');
    const startDialog = document.querySelector('.startDialog');
    const sendMessage = document.querySelector('.sendMessage');
    const inputMessage = document.querySelector('.inputMessage');

    let divCounter = 0;

    let initApp = function() {
        SimulationDataBase.startServer();

        startDialog.addEventListener('click',setUserNick);
        startDialog.addEventListener('click', View.hideNickFieldAndShowMessageField);

        inputMessage.addEventListener('focus', ()=>{View.renderStatusMessage(true,'user')});
        inputMessage.addEventListener('blur', ()=>{View.renderStatusMessage(false,'user')});

        sendMessage.addEventListener('click', setUserMessage);
    }

    let setUserNick = function() {
       let userNick = inputNickName.value;

        Model.getUserNick(userNick);
    }

    let setUserMessage = function() {
        let userMessage = inputMessage.innerHTML;

        divCounter++;

        Model.getUserMessage(userMessage);

        setDateMessage();

        View.renderMessage(divCounter, 'user');

        View.cleanMessageField(inputMessage);

        generateBotResponse(divCounter);

        View.renderStatusMessage(true, 'bot');

        setTimeout(View.renderMessage, Model.intervalOfReqwest, divCounter,'bot');

        // int();
        //clearTimeout(int);
    }

    let setDateMessage = function() {
        let dateMessage;
        let date = new Date();
        let hourse;
        let minutes;

        if (date.getHours() < 10) {hourse = '0'+ date.getHours()} else {hourse = date.getHours() };
        if (date.getMinutes() < 10) {minutes = '0'+ date.getMinutes()} else {minutes = date.getMinutes() };
        dateMessage = hourse + ':' + minutes;

        Model.getDateMessage(dateMessage);
    }

    let addListenerToRemoveMessage = function(element){
      element.addEventListener('click', View.removeMessage);
    }

    let generateBotResponse = function(divCounter) {
        let arrayOfConsilience = [];
        let arrayOfResponse = [];

        SimulationDataBase.collectionOfRegExp.forEach((element)=>{
            arrayOfConsilience.push(Model.userMessage[divCounter-1].search(element));
        });

        let LengthOfUserQuestion = Model.userMessage[divCounter-1].split(' ').length;

        arrayOfConsilience.forEach((element,index)=>{
            if(element>-1) {
                if (LengthOfUserQuestion > SimulationDataBase.lengthRegExpCollection[index]) {
                    let randomness = Math.random();
                    arrayOfResponse[0] = 'НС ';
                    if (randomness>0.5) {
                        arrayOfResponse[element + 1] = SimulationDataBase.collectionOfResponseIncorrectQuestion[index].one + '...';
                    } else {
                        arrayOfResponse[element + 1] = SimulationDataBase.collectionOfResponseIncorrectQuestion[index].two + '...';
                    };
                } else {
                    let randomness = Math.random();
                    arrayOfResponse[0] = 'ТС ';
                    if (randomness>0.5) {
                        arrayOfResponse[element + 1] = SimulationDataBase.collectionOfResponseCorrectQuestion[index].one + '...';
                    } else {
                        arrayOfResponse[element + 1] = SimulationDataBase.collectionOfResponseCorrectQuestion[index].two + '...'
                    };
                };
            }
        });

        let alisaResponse =  arrayOfResponse.join('');

        let messageExeption = arrayOfConsilience.every( element => element < 0);

        if (messageExeption == true){
            if (Model.userMessage[divCounter-1] !== '') {
            let randomness = Math.random();
                if (randomness>0.5) {
                    alisaResponse = SimulationDataBase.exeptionQwestion[0].one;
                } else {
                    alisaResponse = SimulationDataBase.exeptionQwestion[0].two;
                };
        } else {
                let randomness = Math.random();
                if (randomness>0.5) {
                    alisaResponse = SimulationDataBase.exeptionQwestion[1].one;
                } else {
                    alisaResponse = SimulationDataBase.exeptionQwestion[1].two;
                };
            };
        }

        Model.getBotResponse(alisaResponse,divCounter);
    }

    return {
        initApp:initApp,
        addListenerToRemoveMessage:addListenerToRemoveMessage
    }

})();

/*------------------------------------------SIMULATION DATA BASE---------------------------------------*/

let SimulationDataBase = (function() {

    const collectionOfRegExp = [/react/i,/доллар/i,/любовь/i,/SharpMinds/i,/регулярка/i];
    const collectionOfResponseCorrectQuestion = [
        {one:'прикольная штука', two:'это кастрированный Angular)))'},
        {one:'с нашим НБУ, гривне торба(((', two:'думаю, скоро до 30 дойдет'},
        {one: 'это самая прекрасная цепочка химических реакций', two: 'любовь - то, что делает нас лучше'},
        {one: 'крутая контора)))', two:'по ходу - самая большая ІТ контора в Черновцах'},
        {one: 'штука простая как борщ, но нужно практиковать!', two:'люблю я регулярку, но странною любовью'}
    ];
    const collectionOfResponseIncorrectQuestion = [
        {one:'Ого, настрочил))) прикольная штука',two:'мне Angular больше нравиться'},
        {one:'Ты б еще больше написал))) с нашим НБУ, гривне торба(((', two:'Эти вопросы к ПЭТЕ'},
        {one: 'Ну-у-у, это самая прекрасная цепочка химических реакций', two:'Самое сильное чувство'},
        {one: 'Да-да, я знаю - крутая контора)))',two:'У-и-и, у них есть печеньки)))'},
        {one: 'Ох уж эти регулярки, штука простая как борщ, но нужно практиковать!',two:'нужная вещь !'}
    ];
    const lengthRegExpCollection = [1,1,1,1,1];
    const exeptionQwestion = [
        {one: 'Ничего не поняла, я блондинка :)', two:'Ты мне взрываешь мозг :)'},
        {one:'Ну что ты молчишь как на первом свидании)))', two:'Ты че, нимой?)))',}
    ]

    function startServer(){
        this.collectionOfRegExp = collectionOfRegExp;
        this.collectionOfResponseCorrectQuestion = collectionOfResponseCorrectQuestion;
        this.collectionOfResponseIncorrectQuestion = collectionOfResponseIncorrectQuestion;
        this.lengthRegExpCollection = lengthRegExpCollection;
        this.exeptionQwestion = exeptionQwestion;
    };

    return{
        startServer:startServer
    }

})();

/*------------------------------------------START APPLICATION-----------------------------------------*/

Controller.initApp();
