<template>
    <div>
        <header>
            <h1>CSV Visualizer</h1>
            <p>This is a DBL project</p>
            <FileImport/>
        </header>
    </div>
</template>

<script>
    import FileImport from './FileImport'
    export default {
    components: {
    FileImport
  }
    }
</script>

<style>
    header {
	color: white;
	text-align: center;
	font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
	background-color: #2a3b4b;
	padding: 10px;
	z-index: 10;
}
</style>