/* hamburger */
const hamburger = document.querySelector(".hamburger");

hamburger.addEventListener("click" , (e)=>{
    if(e.target.src.includes("images/hamburger.svg")){
        e.target.src = "images/xmark.svg";
    }else{
        e.target.src = "images/hamburger.svg";
    }
    document.querySelector("header .right").classList.toggle("show");
})


/* api call */

const inputField = document.querySelector(".input__shorlink");
const shortenBtn = document.querySelector(".submit-btn");
const shortlinks = [] ;


shortenBtn.addEventListener("click", () => {

    if (isUrlValid(inputField.value)) {

      document.querySelector(".error").style.opacity = 0;
      inputField.classList.remove("showError");
  
      callAPi(inputField.value)
        .then(shortlink => {
          shortlinks.push(shortlink); 
          render();
          inputField.value = "";
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });

    } else {

      document.querySelector(".error").style.opacity = 1;
      inputField.classList.add("showError");
      
    }

});

/* 


{code: 'YB5V7h', short_link: 'shrtco.de/YB5V7h', full_short_link: 'https://shrtco.de/YB5V7h', short_link2: '9qr.de/YB5V7h', full_short_link2: 'https://9qr.de/YB5V7h', original_link
 …}


 */

function render(){

    let html = "";
    
    for(let i = shortlinks.length -1 ; i >= 0 ; i--){
        html += `
                <div class="container">
                    <p class="rowlink">
                    ${shortlinks[i].original_link}
                    </p>
                    <div class="shortlink">
                    <p>${shortlinks[i].short_link}</p>
                    <button class="btn copy-btn" onclick="copyLink(${i},this)">Copy </button>
                    </div>
                </div>
                `;
    };

    document.querySelector(".result").innerHTML = html;
}

function copyLink(index,element) {
    // Get the text field
    let copyText = shortlinks[index].short_link;
  
    // Select the text field
    /* copyText.select();
    copyText.setSelectionRange(0, 99999); */ // For mobile devices
  
     // Copy the text inside the text field
    navigator.clipboard.writeText(copyText);
    element.textContent = "Copied!";
    element.style.backgroundColor = "#3B3054";
  }

function callAPi(link) {

    const endpoint = `https://api.shrtco.de/v2/shorten?url=${link}`;
  
    return new Promise((resolve, reject) => {
      fetch(endpoint)
        .then(response => response.json())
        .then(data => resolve(data.result)) // Resolve with the shortened URL
        .catch(error => reject(error)); // Reject if there's an error during the API call
    });

}

function isUrlValid(str) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    return pattern.test(str);
   }
