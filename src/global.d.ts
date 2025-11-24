/// <reference types="@react-three/fiber" />

import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// This makes all three.js objects available as JSX elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

export {}
