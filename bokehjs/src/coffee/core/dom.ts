import {isBoolean, isString, isArray, isObject} from "./util/types"

/// <reference path="./jsx.d.ts" />

export type HTMLAttrs = { [name: string]: any }
export type HTMLChild = string | HTMLElement | (string | HTMLElement)[]

const _createElement = (tag: string) => (attrs: HTMLAttrs = {}, ...children: HTMLChild[]): HTMLElement => {
  const element: HTMLElement = document.createElement(tag)

  for (const attr in attrs) {
    const value = attrs[attr]

    if (value == null || isBoolean(value) && !value)
      continue

    if (attr === "class" && isArray(value)) {
      for (const cls of (value as string[])) {
        if (cls != null) element.classList.add(cls)
      }
      continue
    }

    if (attr === "style" && isObject(value)) {
      for (const prop in value) {
        (element.style as any)[prop] = value[prop]
      }
      continue
    }

    if (attr === "data" && isObject(value)) {
      for (const key in value) {
        element.dataset[key] = value[key]
      }
      continue
    }

    element.setAttribute(attr, value)
  }

  function append(child: HTMLElement | string) {
    if (child instanceof HTMLElement)
      element.appendChild(child)
    else if (isString(child))
      element.appendChild(document.createTextNode(child))
    else if (child != null && child !== false)
      throw new Error(`expected an HTMLElement, string, false or null, got ${JSON.stringify(child)}`)
  }

  for (const child of children) {
    if (isArray(child)) {
      for (const _child of child)
        append(_child)
    } else
      append(child)
  }

  return element
}

export function createElement(tag: string, attrs: HTMLAttrs, ...children: HTMLChild[]): HTMLElement {
  return _createElement(tag)(attrs, ...children)
}

export const
  div    = _createElement("div"),
  span   = _createElement("span"),
  link   = _createElement("link"),
  style  = _createElement("style"),
  a      = _createElement("a"),
  p      = _createElement("p"),
  pre    = _createElement("pre"),
  button = _createElement("button"),
  label  = _createElement("label"),
  input  = _createElement("input"),
  select = _createElement("select"),
  option = _createElement("option"),
  canvas = _createElement("canvas"),
  ul     = _createElement("ul"),
  ol     = _createElement("ol"),
  li     = _createElement("li");

export const nbsp = document.createTextNode("\u00a0")

export function removeElement(element: HTMLElement): void {
  const parent = element.parentNode
  if (parent != null) {
    parent.removeChild(element)
  }
}

export function replaceWith(element: HTMLElement, replacement: HTMLElement): void {
  const parent = element.parentNode
  if (parent != null) {
    parent.replaceChild(replacement, element)
  }
}


export function prepend(element: HTMLElement, ...nodes: HTMLElement[]): void {
  const first = element.firstChild
  for (const node of nodes) {
    element.insertBefore(node, first)
  }
}

export function empty(element: HTMLElement): void {
  let child
  while (child = element.firstChild) {
    element.removeChild(child)
  }
}

export function show(element: HTMLElement): void {
  element.style.display = ""
}

export function hide(element: HTMLElement): void {
  element.style.display = "none"
}

export function position(element: HTMLElement) {
  return {
    top: element.offsetTop,
    left: element.offsetLeft,
  }
}

export function offset(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  return {
    top:  rect.top  + window.pageYOffset - document.documentElement.clientTop,
    left: rect.left + window.pageXOffset - document.documentElement.clientLeft,
  }
}

export function matches(el: HTMLElement, selector: string): boolean {
  const p: any = Element.prototype
  const f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector
  return f.call(el, selector)
}

export enum Keys {
  Tab   =  9,
  Enter = 13,
  Esc   = 27,
  Up    = 38,
  Down  = 40,
}
