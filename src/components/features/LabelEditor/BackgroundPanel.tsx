'use client'

import { useState } from 'react'
import { useEditorStore } from '@/lib/store/editorStore'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Paintbrush, Palette, Grid3x3, Shapes, Plus, Trash2 } from 'lucide-react'

export function BackgroundPanel() {
  const { canvas, setBackground, addDecorativeShape, removeDecorativeShape } = useEditorStore()
  const background = canvas.background

  const [gradientAngle, setGradientAngle] = useState(135)

  const handleTypeChange = (type: 'none' | 'solid' | 'gradient' | 'pattern') => {
    setBackground({ type })
  }

  const handleColorChange = (color: string) => {
    setBackground({ color })
  }

  const handleGradientChange = (colors: Array<{ color: string; position: number }>) => {
    setBackground({
      gradient: {
        type: 'linear',
        colors,
        angle: gradientAngle,
      },
    })
  }

  const handlePatternChange = (
    type: 'dots' | 'stripes' | 'grid' | 'diagonal',
    color: string,
    opacity: number,
    scale: number
  ) => {
    setBackground({
      pattern: {
        type,
        color,
        opacity,
        scale,
      },
    })
  }

  const addShape = (type: 'circle' | 'wave' | 'triangle' | 'rectangle' | 'blob') => {
    addDecorativeShape({
      type,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      color: '#667eea',
      opacity: 0.5,
      rotation: 0,
    })
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Paintbrush className="w-5 h-5" />
        Background Design
      </h2>

      {/* Background Type Selector */}
      <Card className="p-4 mb-4">
        <Label className="text-sm font-medium mb-2 block">Background Type</Label>
        <Select value={background.type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None (White)</SelectItem>
            <SelectItem value="solid">Solid Color</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="pattern">Pattern</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Solid Color Picker */}
      {background.type === 'solid' && (
        <Card className="p-4 mb-4">
          <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Background Color
          </Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={background.color || '#ffffff'}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-16 h-10 p-1"
            />
            <Input
              type="text"
              value={background.color || '#ffffff'}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1"
              placeholder="#ffffff"
            />
          </div>
        </Card>
      )}

      {/* Gradient Editor */}
      {background.type === 'gradient' && (
        <Card className="p-4 mb-4">
          <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Gradient Colors
          </Label>
          
          {/* Preset Gradients */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() =>
                handleGradientChange([
                  { color: '#667eea', position: 0 },
                  { color: '#764ba2', position: 1 },
                ])
              }
              className="h-12 rounded"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            />
            <button
              onClick={() =>
                handleGradientChange([
                  { color: '#f093fb', position: 0 },
                  { color: '#f5576c', position: 1 },
                ])
              }
              className="h-12 rounded"
              style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
            />
            <button
              onClick={() =>
                handleGradientChange([
                  { color: '#4facfe', position: 0 },
                  { color: '#00f2fe', position: 1 },
                ])
              }
              className="h-12 rounded"
              style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
            />
            <button
              onClick={() =>
                handleGradientChange([
                  { color: '#43e97b', position: 0 },
                  { color: '#38f9d7', position: 1 },
                ])
              }
              className="h-12 rounded"
              style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}
            />
            <button
              onClick={() =>
                handleGradientChange([
                  { color: '#fa709a', position: 0 },
                  { color: '#fee140', position: 1 },
                ])
              }
              className="h-12 rounded"
              style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
            />
            <button
              onClick={() =>
                handleGradientChange([
                  { color: '#30cfd0', position: 0 },
                  { color: '#330867', position: 1 },
                ])
              }
              className="h-12 rounded"
              style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}
            />
          </div>

          {/* Angle Control */}
          <div className="mt-3">
            <Label className="text-xs text-gray-600 mb-1 block">Angle: {gradientAngle}°</Label>
            <input
              type="range"
              min="0"
              max="360"
              value={gradientAngle}
              onChange={(e) => {
                const angle = parseInt(e.target.value)
                setGradientAngle(angle)
                if (background.gradient) {
                  setBackground({
                    gradient: {
                      ...background.gradient,
                      angle,
                    },
                  })
                }
              }}
              className="w-full"
            />
          </div>
        </Card>
      )}

      {/* Pattern Selector */}
      {background.type === 'pattern' && (
        <Card className="p-4 mb-4">
          <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
            <Grid3x3 className="w-4 h-4" />
            Pattern Type
          </Label>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button
              variant={background.pattern?.type === 'dots' ? 'default' : 'outline'}
              onClick={() => handlePatternChange('dots', '#000000', 0.1, 1)}
              className="h-20"
            >
              Dots
            </Button>
            <Button
              variant={background.pattern?.type === 'stripes' ? 'default' : 'outline'}
              onClick={() => handlePatternChange('stripes', '#000000', 0.1, 1)}
              className="h-20"
            >
              Stripes
            </Button>
            <Button
              variant={background.pattern?.type === 'grid' ? 'default' : 'outline'}
              onClick={() => handlePatternChange('grid', '#000000', 0.1, 1)}
              className="h-20"
            >
              Grid
            </Button>
            <Button
              variant={background.pattern?.type === 'diagonal' ? 'default' : 'outline'}
              onClick={() => handlePatternChange('diagonal', '#000000', 0.1, 1)}
              className="h-20"
            >
              Diagonal
            </Button>
          </div>

          {background.pattern && (
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Pattern Color</Label>
                <Input
                  type="color"
                  value={background.pattern.color}
                  onChange={(e) =>
                    handlePatternChange(
                      background.pattern!.type,
                      e.target.value,
                      background.pattern!.opacity,
                      background.pattern!.scale
                    )
                  }
                  className="w-full h-10"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">
                  Opacity: {(background.pattern.opacity * 100).toFixed(0)}%
                </Label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={background.pattern.opacity}
                  onChange={(e) =>
                    handlePatternChange(
                      background.pattern!.type,
                      background.pattern!.color,
                      parseFloat(e.target.value),
                      background.pattern!.scale
                    )
                  }
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">
                  Scale: {background.pattern.scale.toFixed(1)}x
                </Label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={background.pattern.scale}
                  onChange={(e) =>
                    handlePatternChange(
                      background.pattern!.type,
                      background.pattern!.color,
                      background.pattern!.opacity,
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full"
                />
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Decorative Shapes */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
          <Shapes className="w-4 h-4" />
          Decorative Shapes
        </Label>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <Button variant="outline" size="sm" onClick={() => addShape('circle')}>
            <Plus className="w-3 h-3 mr-1" />
            Circle
          </Button>
          <Button variant="outline" size="sm" onClick={() => addShape('rectangle')}>
            <Plus className="w-3 h-3 mr-1" />
            Square
          </Button>
          <Button variant="outline" size="sm" onClick={() => addShape('triangle')}>
            <Plus className="w-3 h-3 mr-1" />
            Triangle
          </Button>
          <Button variant="outline" size="sm" onClick={() => addShape('wave')}>
            <Plus className="w-3 h-3 mr-1" />
            Wave
          </Button>
          <Button variant="outline" size="sm" onClick={() => addShape('blob')}>
            <Plus className="w-3 h-3 mr-1" />
            Blob
          </Button>
        </div>

        {/* List of added shapes */}
        {background.decorativeShapes && background.decorativeShapes.length > 0 && (
          <div className="space-y-2 mt-3 pt-3 border-t">
            <Label className="text-xs text-gray-600">Added Shapes:</Label>
            {background.decorativeShapes.map((shape) => (
              <div
                key={shape.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
              >
                <span className="capitalize">{shape.type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDecorativeShape(shape.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
