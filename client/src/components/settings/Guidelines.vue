<template>
    <div>
        <div class="textHeader" :class="{darkmode: darkmode == 'true'}">
            <div class="top"></div>
            <div class="heading">
                <h1>GUIDELINES</h1>
            </div>
        </div>

        <div class="textParagraph" :class="{darkmode: darkmode == 'true'}">
            <div class="top">
                <div class="heading">
                    <p>
                    taku was made with the intent of compiling backgrounds and bringing the anime community together.<br>
                    <br>
                    The guidelines describe what can or can't be done within the platform to ensure the community's experience. If you come across a message that appears to break these rules, please report it to us. We will proceed by issuing warnings, removing the content, or removing the accounts responsible.<br>
                    <br>
                    The overwhelming majority of people use taku responsibly, so these guidelines may seem obvious. Still, we want to be clear about the expectations for our users.<br>
                    <br>
                    Here's what you can't or can do:<br>
                    <br>
                    - Do not organize, participate in, or encourage harassment of others. People can disagree on opinions, but continuous, repetitive, or severe negative comments can cross the line into harassment and are not okay.<br>
                    <br>
                    - Do not organize, promote, or coordinate hate speech. It’s unacceptable to attack a person or a community based on attributes such as their race, ethnicity, national origin, sex, gender, sexual orientation, religious affiliation, or disabilities.<br>
                    <br>
                    - Do not make threats of violence or threaten to harm others. This includes indirect threats, as well as sharing or threatening to share someone’s private personal information (also known as doxxing).<br>
                    <br>
                    Here are some rules for content on taku:<br>
                    <br>
                    - You may not sexualize minors in any way. This includes sharing content or links which depict minors in a pornographic, sexually suggestive, or violent manner, and includes illustrated or digitally altered pornography that depicts minors (such as lolicon, shotacon, or cub). We report illegal content to the National Center for Missing and Exploited Children.<br>
                    <br>
                    - You may not share sexually explicit content of other people without their consent, or share or promote sharing of non-consensual intimate imagery (also known as revenge porn) in an attempt to shame or degrade someone.<br>
                    <br>
                    - You may not share content that glorifies or promotes suicide or self-harm, including any encouragement to others to cut themselves, or embrace eating disorders such as anorexia or bulimia.<br>
                    <br>
                    - You may not share images of sadistic gore or animal cruelty.<br>
                    <br>
                    In general, you should not promote, encourage or engage in any illegal behavior. This is very likely to get you kicked off taku, and may get you reported to law enforcement.<br>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: () => {
        return {
            darkmode: localStorage.darkmode,
        };
    },
}

</script>

<style scoped>
.textHeader {
  background: rgba(255, 255, 255, 0);
  padding: 12px;
  border-radius: 8px;
  margin-top: 16px;
  margin-left: 16px;
  margin-right: 16px;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
}
.textHeader.darkmode { /* darkmode */
  background: #10121d00;
  color: white;
}
.textHeader.darkmode .top .heading img                                       { filter: invert(1); }      /* darkmode */ 
.textHeader.darkmode .bottom, .textHeader.darkmode .textField                 { background: #10121d00; }  /* darkmode */
.textHeader.darkmode .bottom a:not(:hover), .textHeader.darkmode .textField   { color: white; }         /* darkmode */
.textHeader.darkmode .bottom img:not(:hover)                                 { filter: invert(1); }      /* darkmode */
.textHeader div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.textParagraph {
  background: rgba(255, 255, 255, 0);
  padding: 12px;
  border-radius: 8px;
  margin-top: 16px;
  margin-left: 16px;
  margin-right: 16px;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
}
.textParagraph.darkmode { /* darkmode */
  background: #10121d00;
  color: white;
}
.textParagraph.darkmode .top .heading img                                       { filter: invert(1); }      /* darkmode */ 
.textParagraph.darkmode .bottom, .textParagraph.darkmode .textField                 { background: #10121d00; }  /* darkmode */
.textParagraph.darkmode .bottom a:not(:hover), .textParagraph.darkmode .textField   { color: white; }         /* darkmode */
.textParagraph.darkmode .bottom img:not(:hover)                                 { filter: invert(1); }      /* darkmode */
.textParagraph div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
