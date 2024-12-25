import * as THREE from 'three';

export class ChristmasTree {
    constructor() {
        this.treeGroup = new THREE.Group();
        this.createTree();
    }

    createTree() {
        // 创建树干
        const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.6, 2, 8);
        const trunkMaterial = new THREE.MeshPhongMaterial({
            color: 0x3d1f00,
            shininess: 5
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = -1;
        trunk.castShadow = true;
        this.treeGroup.add(trunk);

        // 创建树冠
        const treeColors = [
            0x0d5a1e, // 深绿
            0x0f6d23, // 中绿
            0x117a28  // 浅绿
        ];

        // 从底部到顶部创建4层锥体
        const layers = [
            { radius: 2.5, height: 2.5, y: 0 },
            { radius: 2.0, height: 2.0, y: 1.5 },
            { radius: 1.5, height: 1.5, y: 2.5 },
            { radius: 1.0, height: 1.0, y: 3.5 }
        ];

        layers.forEach((layer, i) => {
            const geometry = new THREE.ConeGeometry(
                layer.radius,
                layer.height,
                32,
                1,
                false,
                Math.PI * (i % 2 ? 0.1 : 0) // 交替旋转，增加层次感
            );
            
            const material = new THREE.MeshPhongMaterial({
                color: treeColors[i % treeColors.length],
                shininess: 5,
                flatShading: true
            });

            const cone = new THREE.Mesh(geometry, material);
            cone.position.y = layer.y;
            cone.castShadow = true;
            cone.receiveShadow = true;

            // 给每层添加细微的随机旋转
            cone.rotation.y = Math.random() * Math.PI * 0.1;
            
            this.treeGroup.add(cone);
        });
    }

    addOrnament(ornament) {
        this.treeGroup.add(ornament);
    }

    getObject() {
        return this.treeGroup;
    }
} 