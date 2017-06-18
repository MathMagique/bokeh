# requires $.slider()

import {logger} from "core/logging"
import * as p from "core/properties"
import {empty} from "core/dom"
import {throttle} from "core/util/callback"

import {InputWidget, InputWidgetView} from "./input_widget"

import slidertemplate from "./slidertemplate"


export class SliderView extends InputWidgetView
  template: slidertemplate

  initialize: (options) ->
    super(options)
    empty(@el)
    html = @template(@model.attributes)
    @el.appendChild(html)
    @callbackWrapper = null
    if @model.callback_policy == 'continuous'
      @callbackWrapper = () ->
        @model.callback?.execute(@model)
    if @model.callback_policy == 'throttle' and @model.callback
      @callbackWrapper = throttle(() ->
        @model.callback?.execute(@model)
      , @model.callback_throttle)
    @render()

  connect_signals: () ->
    super()
    @connect(@model.change, () -> @render())

  render: () ->
    super()
    max = @model.end
    min = @model.start
    step = @model.step or ((max - min)/50)
    logger.debug("slider render: min, max, step = (#{min}, #{max}, #{step})")
    opts = {
      orientation: @model.orientation,
      animate: "fast",
      value: @model.value,
      min: min,
      max: max,
      step: step,
      stop: @slidestop,
      slide: @slide
    }
    $(@el.querySelector('.slider')).slider(opts)
    if @model.title?
      @el.querySelector("input").value = $(@el.querySelector('.slider')).slider('value')
    @el.querySelector('.bk-slider-parent').style.height = "#{@model.height}px"
    return @

  slidestop: (event, ui) =>
    if @model.callback_policy == 'mouseup' or @model.callback_policy == 'throttle'
      @model.callback?.execute(@model)

  slide: (event, ui) =>
    value = ui.value
    logger.debug("slide value = #{value}")
    if @model.title?
      @el.querySelector("input").value = ui.value
    @model.value = value
    if @callbackWrapper then @callbackWrapper()

export class Slider extends InputWidget
  type: "Slider"
  default_view: SliderView

  @define {
      value:             [ p.Number,      0.5          ]
      start:             [ p.Number,      0            ]
      end:               [ p.Number,      1            ]
      step:              [ p.Number,      0.1          ]
      orientation:       [ p.Orientation, "horizontal" ]
      callback_throttle: [ p.Number,      200          ]
      callback_policy:   [ p.String,      "throttle"   ] # TODO (bev) enum
    }
