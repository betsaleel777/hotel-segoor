<template>
  <img class="SegoorLogo" alt="Segoor Logo" src="/segoor.jpg" />
</template>

<style>
.SegoorLogo {
  height: 380px;
  width: 380px;
  transform: rotateY(560deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
