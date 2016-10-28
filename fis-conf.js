/**
 * 将 fis 的构建根目录切换到 ./src 目录下，以便更好的管理源代码
 */
fis.project.setProjectRoot('src');

fis.hook('relative');
fis.match('**', { relative: true });

fis.match('::package', {
    postpackager: fis.plugin('loader', {
        allInOne: true
    })
});

/**
 * 发布上线的版本
 */
fis.project.currentMedia() === 'dist' && fis.util.del(fis.project.getProjectPath('./public'));

fis.media('dist')
    .match('*.{js,css,less,png,jpg,jpeg,gif,svg}', {
        useHash: false
    })
    .match('*.png', {
        optimizer: fis.plugin('png-compressor')
    })
    .match('*.{css,less}', {
        optimizer: fis.plugin('clean-css')
    })
    .match('*.{js,tpl}', {
        optimizer: fis.plugin('uglify-js')
    })
    .match('*.min.js', {
        optimizer: null
    });