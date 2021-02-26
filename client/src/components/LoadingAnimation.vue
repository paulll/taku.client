
<template>
    <div class="loadingAnimation">
        <div class="rows">
            <pre id="row1">  ___       ___       ___       ___   </pre>
            <pre id="row2"> /\  \     /\  \     /\__\     /\__\  </pre>
            <pre id="row3"> \:\  \   /::\  \   /:/ _/_   /:/ _/_ </pre>
            <pre id="row4"> /::\__\ /::\:\__\ /::-"\__\ /:/_/\__\</pre>
            <pre id="row5">/:/\/__/ \/\::/  / \;:;-",-" \:\/:/  /</pre>
            <pre id="row6">\:\__\     /:/  /   |:|  |    \::/  /  indev</pre>
            <pre id="row7"> \/__/     \/__/     \|__|     \/__/   v0.75</pre>
        </div>
    </div>
</template>

<script>
export default {
}

</script>

<style scoped>

.loadingAnimation {
    display: fixed;
    width: 100vw;
    height: 100vh;
    background: #FF84AD;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
}

.loadingAnimation .rows pre {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-family: monospace;
    color: white;
}

@keyframes slide {
  0% { transform: translateX(100vw); }
  30% { transform: translateX(0); }
  70% { transform: translateX(0); }
  100% { transform: translateX(-100vw); }
}

#row1, #row3, #row5, #row7 { animation: 2.5s ease-in-out slide infinite ; }
#row2, #row4, #row6 { animation: 2.5s ease-in-out reverse slide infinite ; }

#row1 { animation-delay: 0ms; } 
#row3 { animation-delay: 50ms; } 
#row5 { animation-delay: 100ms; } 
#row7 { animation-delay: 150ms; }

#row2 { animation-delay: 0ms; } 
#row4 { animation-delay: 50ms; } 
#row6 { animation-delay: 100ms; } 

</style>
