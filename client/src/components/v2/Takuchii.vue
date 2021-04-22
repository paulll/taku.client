<template>
    <div class="takuchii">  
        <h1 class="emoji">{{emoji}}</h1>
        <h1 class="message">{{message}}</h1>
    </div>
</template>

<script>
export default {
    props: {
        message:{ type: String, required: true },
        emoji:{ type: String, required: true },
    },
}
</script>

<style scoped>
.takuchii {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(244px);
}

.takuchii .message {
  margin-bottom: 12px;
  color: #81859D;
  text-align: center;
  margin-top: 8px;
  font-weight: 500;
  font-size: 16px;
}

.takuchii .emoji {
  font-size: 32px;
  color: #81859D;
}
</style>