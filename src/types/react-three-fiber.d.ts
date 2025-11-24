/// <reference types="@react-three/fiber" />

// Extend React Three Fiber types
import { Object3DNode } from '@react-three/fiber'
import { Mesh, BufferGeometry, Material } from 'three'

declare module '@react-three/fiber' {
  interface ThreeElements {
    mesh: Object3DNode<Mesh, typeof Mesh>
  }
}

