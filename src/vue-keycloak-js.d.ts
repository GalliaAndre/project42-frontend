// Workaround for untyped package
declare module '@dsb-norge/vue-keycloak-js' {
  function value(): object;
  export default value;
}
