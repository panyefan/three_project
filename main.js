import './style.css';

import * as THREE from 'three';
import Cube from './src/cube';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

class App {
  // 存储实例
  static app = undefined;

  // 渲染器，开启抗锯齿
  renderer = new THREE.WebGLRenderer({ antialias: true });

  // 创建场景
  scene = new THREE.Scene();

  // 创建摄像头
  camera = new THREE.PerspectiveCamera(
    75, // 透视角度，即眼睛能看到的角度范围，一般设置50到75
    window.innerWidth / window.innerHeight, // 纵横比例
    0.1, // 近距离位置
    10000 // 原距离位置
  );

  // 模型列表
  modelList = [];

  // 创建状态
  stats = Stats();

  // 创建交互面板
  gui = undefined;

  // 渲染器设置
  rendererSetting = (dom = document.querySelector('#app')) => {
    // 设置渲染像素值大小
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // 渲染所需尺寸
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // 渲染Dom，添加到App
    dom.appendChild(this.renderer.domElement);

    // 状态Dom，添加App
    dom.appendChild(this.stats.dom);

    // 摄像头位置
    this.camera.position.z = 5;

    window.addEventListener('resize', () => {
      // 渲染器，需要设置尺寸
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      // 比例重制
      this.camera.aspect = window.innerWidth / window.innerHeight;

      // 更新矩阵Matrix
      this.camera.updateProjectionMatrix();
    });
  };

  // 动画
  animate = () => {
    requestAnimationFrame(this.animate);
    this.render();
  };

  // 渲染
  render = () => {
    // 状态开始
    this.stats.begin();
    this.modelAnimate();
    // 状态结束
    this.stats.end();
    this.renderer.render(this.scene, this.camera);
    // 更新状态
    this.stats.update();
  };

  // 渲染模型的动画
  modelAnimate = () => {
    this.modelList.forEach((element) => {
      element.animate();
    });
  };

  // 添加多个模型
  addModelList = (list) => {
    if (Array.isArray(list) && list.length) {
      list.forEach((element) => {
        this.addModel(element);
      });
    }
  };

  // 添加模型
  addModel = (element) => {
    this.scene.add(element.model);
    this.modelList.push(element);
    this.gui = element.guiInteractive(this.gui);
  };

  constructor(modelList = []) {
    // 单例模式，确保只有一个实例
    if (App.app) return;
    App.app = this;
    this.rendererSetting();
    this.animate();
    this.addModelList(modelList);
  }
}
const app = new App([
  new Cube({ animateSwitch: true, guiInteractiveSwitch: true }),
]);
// const cube = new Cube();

// app.addModel(cube);
