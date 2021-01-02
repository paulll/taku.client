<template>
  <div class="home">
    <div class="tag-grid">

    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data: () => {
    return {
    };
  },
  mounted() {
  },
  methods: {
  }
}

</script>

<style scoped>

.center-text {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.267);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tag-grid {
  padding: 32px;
  display: grid;
  gap: 4px;

  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  grid-auto-rows: 90px;
}
.tag-grid .card {
  background-size: cover;
  background-position: center;
  background-size: 100%;
  transition: 100ms ease;
}

.tag-grid .card:hover {
  background-size: 110%;
  cursor: pointer;
}

/* Medium screens */
@media screen and (min-width: 600px) {
  .tag-grid .card-tall {
    grid-row: span 2 / auto;
  }

  .tag-grid .card-wide {
    grid-column: span 2 / auto;
  }
}
</style>
