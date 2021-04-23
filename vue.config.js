module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                // 设置打包之后的应用名称
                productName: 'netChat',
                win: {
                    icon: 'public/icon/favicon.ico',
                    // 图标路径 windows系统中icon需要256*256的ico格式图片，更换应用图标亦在此处
                    target: [{
                        // 打包成一个独立的 exe 安装程序
                        target: 'nsis',
                        // 这个意思是打出来32 bit + 64 bit的包，但是要注意：这样打包出来的安装包体积比较大
                        arch: [
                            'x64'
                            // 'ia32'
                        ]
                    }]
                },
                files: ['**/*'],
                asar: false,
                nsis: {
                    oneClick: false,
                    // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
                    allowElevation: true,
                    // 允许修改安装目录，建议为 true，是否允许用户改变安装目录，默认是不允许
                    allowToChangeInstallationDirectory: true,
                    // 安装图标
                    installerIcon: 'public/icon/favicon.ico',
                    // 卸载图标
                    uninstallerIcon: 'public/icon/favicon.ico',
                    // 安装时头部图标
                    installerHeaderIcon: 'public/icon/favicon.ico',
                }
            }
        }

    }
}