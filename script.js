let nav = 0; //navigator created to navigate the months o-ths month, +1--> next month
let clicked = null; //same as before but for the day
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];//check later   


const calendar =document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('EventTitleInput')
// Get the button element
const timeButton = document.querySelector('timeButton');

const nameOfDays = ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']; //List order does not matter here

const threshSwipe = 200;
const cooldown = 500;           // minimum delay between month changes (ms)

let scrollAccumulator = 0;
let gestureInProgress = false;


// Adding the weekdays

const monthDay = document.getElementById('weekdays')
nameOfDays.forEach(name =>{

   const partWeek = document.createElement('div')
   partWeek.textContent = name
   monthDay.appendChild(partWeek)
})



function openModal(date){
    clicked = date;

    const eventForDay = events.find(e => e.date == clicked );

    if (eventForDay){
        console.log('Event already exists');
    } else {
       newEventModal.style.display = 'block'; 

    }
    backDrop.style.display = 'block';
}

// Add a mouseover event listener
//timeButton.addEventListener('mouseover', () => {
  // Change the button's background color
//   timeButton.style.backgroundColor = '#cd8888a3';
//});

// Add a mouseout event listener
//timeButton.addEventListener('mouseout', () => {
  // Change the button's background color back to its original color
//  timeButton.style.backgroundColor = '#eae7eafb';
//});

function load(){
    const dt = new Date();

    if (nav !==0){
       dt.setMonth(new Date().getMonth() + nav)  
    }

     const day =dt.getDate(); 
     const month=dt.getMonth();
     const year= dt.getFullYear();

     const FirstDayofMonth = new Date(year,month,1);
     //figure out the number of days in a month
     const daysInMonth= new Date(year, month+1, 0).getDate(); /* the first day of the month starts at one not at zero, 
     writing zero is looking for the previous day of the month before. Writing -1 give the second last day of the month
                           By asking for month+1, we are asking for the current month end day*/

    const dateString= FirstDayofMonth.toLocaleDateString('en-uk',{
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
     });
     const paddingDays = nameOfDays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthTitle').innerText = `${dt.toLocaleDateString('en-uk',{ month: 'long'})} ${year}`;

    remainder = (paddingDays+daysInMonth)%7
    remainder ==0 ? totday = paddingDays+daysInMonth : totday = (7-remainder)+paddingDays+daysInMonth  // calculate the number of padding days for rectangualar matrix with

    calendar.innerHTML= ''; // line to wipe out the previous calendar every time the initButton function is called 
     for(let i = 1; i <= totday; i++){
         const daySquare = document.createElement('div');
         daySquare.classList.add('day');

         daySquare.addEventListener('click', () => openModal(`${i-paddingDays}/${month+1}/${year}`));
         if (i > paddingDays && i <= paddingDays+daysInMonth){
            daySquare.innerText = i-paddingDays;
         } else {
            daySquare.classList.add('padding');
         }
         calendar.appendChild(daySquare)
     }  
    
}

function closeModal(){
    newEventModal.style.display= 'none';
    backDrop.style.display= 'none';
    eventTitleInput.value = ''; // clean the value that was entered
    clicked = null; //want to make sure that openmodal function does not get confused here as the text has been erased
    load();
}

function saveEvent(){
     if (!eventTitleInput.value){
        eventTitleInput.classList.remove('error')
        return;
     } 
     eventTitleInput.classList.remove('error');

     events.push({
        date: clicked,
        title: eventTitleInput.value
     });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}

window.onload = function () {

   // Trackpad/mouse vertical scroll
   calendar.addEventListener('wheel', e => {

      e.preventDefault();

      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; //verify user scrolls in right direction
      if (gestureInProgress) return;
       // Accumulate deltaX
      scrollAccumulator += e.deltaX;

       // Prevent embedded computer movement
       

      // If we're currently processing a month change, ignore events
      if (scrollAccumulator >= threshSwipe){
         nav++;
         load();
         gestureInProgress = true;
         scrollAccumulator=0;
         setTimeout(() => gestureInProgress = false, cooldown)

      }
      else if (scrollAccumulator <= -threshSwipe){
         nav--;
         load();
         gestureInProgress = true;
         scrollAccumulator=0;
         setTimeout(() => gestureInProgress = false, cooldown)
      }
   });
}

document.getElementById('saveButton').addEventListener('click', saveEvent);
document.getElementById('cancelButton').addEventListener('click', closeModal); 



load();
