<script setup></script>

<template>
  <div class="bg-gray-950 dark:text-slate-100">
    <div
      class="absolute inset-0 z-0
             bg-[radial-gradient(ellipse_at_20%_30%,rgba(56,189,248,0.4)_0%,transparent_60%),radial-gradient(ellipse_at_80%_70%,rgba(139,92,246,0.3)_0%,transparent_70%),radial-gradient(ellipse_at_60%_20%,rgba(236,72,153,0.25)_0%,transparent_50%),radial-gradient(ellipse_at_40%_80%,rgba(34,197,94,0.2)_0%,transparent_65%)]">
    </div>
    <div class="animated animatedFadeInUp fadeInUp">
      <slot />
    </div>
  </div>
</template>

<style>
/* Animation */

@keyframes fadeInUp {
  from {
    transform: translate3d(0, 10px, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@-webkit-keyframes fadeInUp {
  from {
    transform: translate3d(0, 10px, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

/* Define animated class */
.animated {
  animation-duration: 0.7s;
  animation-fill-mode: both;
  -webkit-animation-duration: 0.7s;
  -webkit-animation-fill-mode: both;
}

/* Define custom class for fade in animation */
.animatedFadeInUp {
  opacity: 0;
}

.fadeInUp {
  opacity: 0;
  animation-name: fadeInUp;
  -webkit-animation-name: fadeInUp;
}

/* Media query for smaller screens */
@media screen and (max-width: 768px) {
  .animatedFadeInUp,
  .fadeInUp {
    opacity: 1;
    animation-name: none !important;
    -webkit-animation-name: none !important;
  }
}

@media screen and (max-width: 768px) {
  #particles-js {
    min-width: 100vw;
    min-height: 100vh;
    position: absolute;
    z-index: -1;
  }
}
</style>
