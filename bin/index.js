#!/usr/bin/env node

const mysql = require('promise-mysql');
const program = require('commander');

program
.version('1.0.0')
.arguments('<oldUrl> <newUrl>')
.description('replaces the site url in a wordpress database')
.action(async (oldUrl, newUrl) => {
    try {
        const connection = await mysql.createConnection({
            host: '192.168.94.100',
            user: 'root',
            password: 'root',
            database: 'local',
            port: 4010
        });
    
        await connection.query(`UPDATE wp_options SET option_value = replace(option_value, '${oldUrl}', '${newUrl}') WHERE option_name = 'home' OR option_name = 'siteurl';`);
        await connection.query(`UPDATE wp_posts SET guid = replace(guid, '${oldUrl}','${newUrl}');`);
        await connection.query(`UPDATE wp_posts SET post_content = replace(post_content, '${oldUrl}', '${newUrl}');`);
        await connection.query(`UPDATE wp_postmeta SET meta_value = replace(meta_value,'${oldUrl}','${newUrl}');`);
    
        connection.destroy();
    }
    catch (err) {
        console.error(err);
    }
});

program.parse(process.argv);