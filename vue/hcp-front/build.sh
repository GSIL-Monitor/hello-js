#node 6.10 请在build.sh 设置环境变量:
# export NODE_PATH=/home/xiaoju/node-v6.10.0-linux-x64:/home/xiaoju/node-v6.10.0-linux-x64/lib/node_modules
# export PATH=/home/xiaoju/node-v6.10.0-linux-x64/bin:$PATH

pid=$$
function make_output() {
    # 创建output目录，用于存放产出
    local output="output"
    if [ -d $output ];then
        rm -rf $output
    fi
    mkdir -p $output
    local directory="train"
    local resourceDir="./src/assets/resource"
    local outputResourceDir="output/static/resource"
    # 填充output目录, output的内容即为待部署内容
    # cp -rf $file $directory ${output}/       # 拷贝必要的文件和目录至output目录,
    cp -rf ${directory}/* ${output}/       # 拷贝必要的文件和目录至output目录,

    mkdir ${outputResourceDir}
    cp -rf ${resourceDir}/* ${outputResourceDir}/
                                             #此处$file和$directory表分别示欲拷贝的文件和目录
    cp -r dockerconfig ${output}/       # Dockerfile config
    cp  Dockerfile ${output}/       # Dockerfile
    local ret=$?
    return $ret
}

##########################################
## main
## 其中,
##
##      1.生成部署包output
##########################################
# 1.生成部署包output
make_output
ret=$?
if [ $ret -eq 0 ];then
    echo -e "===== Generate output ok ====="
else
    echo -e "===== Generate output failure ====="
fi
exit $ret
