<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Heal Sim</router-link> |
      <router-link to="/remSim">Rem Sim</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
  html {
    background-color: #222;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #1f1d24;
    margin-top: 30px;
  }

#nav {
  padding: 15px;
}

#nav a {
  font-size:1.2rem;
  font-weight: bold;
  color: #976e00;
  padding: 5px;
  border: 1px solid #976e00;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #d9b100;
  text-shadow: 0 0 3px #a67c00;
  border: 1px solid #d9b100;
}

  #nav a:hover {
    border: 1px solid #d9b100;
    box-shadow:0 0 3px 0px #d9b100;
  }


</style>
