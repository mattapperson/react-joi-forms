module.exports = function(wallaby) {
    return {
        files: ["src/**/*.js?(x)", "!src/**/*.spec.js?(x)"],
        tests: ["src/**/*.spec.js?(x)"],

        env: {
            type: "node",
            runner: "node"
        },

        compilers: {
            "**/*.js?(x)": wallaby.compilers.babel()
        },

        testFramework: "jest",

        debug: true
    };
};
