<template>
    <div>
        <label>
            <div>
                <span v-if="csv">Selected File: {{csv.name}}</span>
                <span v-else>Select CSV File</span>
            </div>
            <input type="file" @change="handleFileChange"/>
        </label>
    </div>
</template>

<script>

</script>

<style>

</style>
