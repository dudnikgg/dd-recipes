export default () => {
  const nuxtApp = useNuxtApp();
  return {
    // this coming from gsap plugin, which will be also auto registered
    gsap: nuxtApp.$gsap,
  };
};
