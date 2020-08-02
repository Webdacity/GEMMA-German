const api_url = "https://gemma-backend.herokuapp.com";
// const api_url = "http://localhost:3000";


// ANIMATIONS

// Navbar Open & Close

const openNav = () => {
    // $(".navbar-content").css("width", "25vw");
    $(".navbar").addClass("open");
    $(".navbar-page-wrapper").fadeIn(1000)
}

const closeNav = () => {
    // $(".navbar-content").css("width", "0");
    $(".navbar").removeClass("open");
    $(".navbar-page-wrapper").fadeOut(1000)
}

$(".navbar-page-wrapper").click(() => {
    closeNav();
})

// Hide Navbar on Scroll

var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("navbar").style.top = "0";
    } else {
        document.getElementById("navbar").style.top = "-75px";
    }
    prevScrollpos = currentScrollPos;
}

// Page Loader

const showLoader = () => {
    $(".loader").fadeIn(1000);
}

const hideLoader = () => {
    $(".loader").fadeOut(1000);
}

window.onload = (event) => {
    hideLoader()
};

// Footer
$(document).ready(() => {

    $.get("./footer.html", function (data) {
        $("#footer").html(data)
    });

});

// Feedback Forms

$("form .form-rating span").click(function () {
    $(this).closest(".form-rating").find("span").removeClass("clicked");
    $(this).addClass("clicked");
});

// Video
const pageName = window.location.pathname;
if (pageName === "/" || pageName === "/index.html" || pageName === "/about.html") {
    const iframe = document.querySelector('.video-frame iframe');
    const player = new Vimeo.Player(iframe);

    $(".video-frame .video-overlay button").click(() => {
        $(".video-overlay").fadeOut("slow");
        player.play()
    })
}


// ----------------------------------------------
// FORMS

// Send Ping to Wake Server

if (pageName === "/feedback.html" || pageName === "/application.html") {
    axios({
            method: "get",
            url: "https://gemma-backend.herokuapp.com/ping"
        })
        .then(result => {
            console.log("Server Pinged: " + result.status)
        })
}

// Modal 

const showSubmissionModal = (text) => {
    $('#submission-modal p').html(text);
    $('#submission-modal').modal('toggle');

}

// Validation

// Validate Form
const validateForm = (formToVal, formURL) => {
    let form = document.getElementById(formToVal);
    let email = $(".order-form [name='email_address']").val();
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (form.checkValidity() === false) {
        console.log("Validation Fail")
        event.preventDefault();
        event.stopPropagation();
        alert("Please ensure that you've completed all the fields.")
    } else {
        console.log("Validation Success")
        submitForm(formToVal, formURL);
    }
    form.classList.add('was-validated');
};

const submitForm = (formID, formURL) => {
    event.preventDefault();

    let formData = $(`#${formID}`).serializeArray();

    if (formID === "website-form") {
        sendForm(formData, formURL)
    }

    // Sessions Form Data Exception (Ratings)
    else if (formID === "session-form") {

        // check for session ratings
        for (let i = 1; i <= 3; i++) {
            if ($(`#question${i}-rating`).find('span.clicked').length === 0) {
                return alert("Please ensure that you have entered the appropriate rating for questions 1 - 3");
            }

            formData.push({
                name: `question${i}-rating`,
                value: $(`#question${i}-rating span.clicked`).html()
            })
        }

        sendForm(formData, formURL)
    }

    // Send Data
    console.log(formData)
}

// Send Form Data

const sendForm = (formData, formURL) => {

    showLoader();
    axios({
            method: "post",
            url: `${api_url}${formURL}`,
            data: formData
        })
        .then(result => {
            console.log(result.data);
            hideLoader()
            if (result.status === 500) {
                alert(result.data.message)
            } else {
                showSubmissionModal("Thank you for submitting your feedback!");
            }
        });

}

const fillFIelds = () => {
    $("form textarea").val("hytg")
}