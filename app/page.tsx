"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw, StepForward } from "lucide-react"

export default function StandingWaveSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [reflectionType, setReflectionType] = useState<"fixed" | "free">("fixed")
  const [showIncidentWave, setShowIncidentWave] = useState(true)
  const [showReflectedWave, setShowReflectedWave] = useState(true)
  const [showStandingWave, setShowStandingWave] = useState(true)
  const [slowMotion, setSlowMotion] = useState(false)
  const [stepMode, setStepMode] = useState(false)
  const [timeStep, setTimeStep] = useState(0.1)
  const [time, setTime] = useState(0)
  const [amplitude, setAmplitude] = useState(50)
  const [frequency, setFrequency] = useState(1)
  const [wavelength, setWavelength] = useState(200)

  // Wave parameters
  const waveParams = {
    amplitude,
    frequency,
    wavelength,
    speed: frequency * wavelength,
  }

  // Function to calculate wave values
  const calculateWave = (
    x: number,
    t: number,
    amplitude: number,
    wavelength: number,
    frequency: number,
    direction: 1 | -1,
    phaseShift = 0,
  ) => {
    const k = (2 * Math.PI) / wavelength // Wave number
    const omega = 2 * Math.PI * frequency // Angular frequency
    return amplitude * Math.sin(k * x * direction - omega * t + phaseShift)
  }

  // Draw the waves on the canvas
  const drawWaves = (time: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerY = canvas.height / 2
    const phaseShift = reflectionType === "fixed" ? Math.PI : 0

    // Draw the waves
    for (let x = 0; x < canvas.width; x++) {
      // Incident wave (traveling to the right)
      if (showIncidentWave) {
        const incidentY = calculateWave(
          x,
          time,
          waveParams.amplitude,
          waveParams.wavelength,
          waveParams.frequency,
          1,
          0,
        )
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
        ctx.beginPath()
        ctx.arc(x, centerY - incidentY, 2, 0, 2 * Math.PI)
        ctx.fill()
      }

      // Reflected wave (traveling to the left)
      if (showReflectedWave) {
        const reflectedY = calculateWave(
          x,
          time,
          waveParams.amplitude,
          waveParams.wavelength,
          waveParams.frequency,
          -1,
          phaseShift,
        )
        ctx.fillStyle = "rgba(0, 0, 255, 0.5)"
        ctx.beginPath()
        ctx.arc(x, centerY - reflectedY, 2, 0, 2 * Math.PI)
        ctx.fill()
      }

      // Standing wave (superposition)
      if (showStandingWave) {
        const incidentY = calculateWave(
          x,
          time,
          waveParams.amplitude,
          waveParams.wavelength,
          waveParams.frequency,
          1,
          0,
        )
        const reflectedY = calculateWave(
          x,
          time,
          waveParams.amplitude,
          waveParams.wavelength,
          waveParams.frequency,
          -1,
          phaseShift,
        )
        const standingY = incidentY + reflectedY

        ctx.fillStyle = "black"
        ctx.beginPath()
        ctx.arc(x, centerY - standingY, 2, 0, 2 * Math.PI)
        ctx.fill()
      }
    }

    // Draw the boundary line
    ctx.strokeStyle = reflectionType === "fixed" ? "#333" : "#999"
    ctx.lineWidth = reflectionType === "fixed" ? 4 : 2
    ctx.beginPath()
    ctx.moveTo(canvas.width - 10, 0)
    ctx.lineTo(canvas.width - 10, canvas.height)
    ctx.stroke()

    // Draw labels for the boundary
    ctx.fillStyle = "#333"
    ctx.font = "14px Arial"
    ctx.textAlign = "right"
    ctx.fillText(reflectionType === "fixed" ? "Fiksuotas Galas" : "Laisvas Galas", canvas.width - 15, 20)
  }

  // Animation loop
  const animate = () => {
    if (!isPlaying && !stepMode) return

    const timeIncrement = slowMotion ? 0.01 : 0.1
    setTime((prevTime) => prevTime + timeIncrement)

    if (!stepMode) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      setIsPlaying(false)
    }
  }

  // Handle step mode
  const handleStep = () => {
    setTime((prevTime) => prevTime + timeStep)
  }

  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      cancelAnimationFrame(animationRef.current)
    }

    return () => cancelAnimationFrame(animationRef.current)
  }, [isPlaying, slowMotion, stepMode])

  // Draw waves when parameters change
  useEffect(() => {
    drawWaves(time)
  }, [time, reflectionType, showIncidentWave, showReflectedWave, showStandingWave, amplitude, frequency, wavelength])

  // Reset the simulation
  const resetSimulation = () => {
    setTime(0)
    setIsPlaying(false)
    cancelAnimationFrame(animationRef.current)
    drawWaves(0)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Stovinčiųjų Bangų Simuliacija</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Bangų Vizualizacija</CardTitle>
              <CardDescription>Vizualizacija, kaip krintančios ir atspindėtos bangos susijungia į stovinčiąsias bangas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border rounded-lg overflow-hidden bg-white">
                <canvas ref={canvasRef} width={800} height={300} className="w-full h-auto" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Nustatymai</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Atspindžio Tipas</h3>
                <Tabs
                  defaultValue="fixed"
                  value={reflectionType}
                  onValueChange={(value) => setReflectionType(value as "fixed" | "free")}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="fixed">Fiksuotas Galas</TabsTrigger>
                    <TabsTrigger value="free">Laisvas Galas</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Bangų Matomumas</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="incident-wave" className="text-sm font-medium">
                      Krintanti Banga (Raudona)
                    </label>
                    <Switch id="incident-wave" checked={showIncidentWave} onCheckedChange={setShowIncidentWave} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="reflected-wave" className="text-sm font-medium">
                      Atsispindėjusi Banga (Mėlyna)
                    </label>
                    <Switch id="reflected-wave" checked={showReflectedWave} onCheckedChange={setShowReflectedWave} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="standing-wave" className="text-sm font-medium">
                      Stovinčioji Banga (Juoda)
                    </label>
                    <Switch id="standing-wave" checked={showStandingWave} onCheckedChange={setShowStandingWave} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Bangų Parametrai</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="amplitude" className="text-sm font-medium">
                        Amplitudė: {amplitude} m
                      </label>
                    </div>
                    <Slider
                      id="amplitude"
                      min={10}
                      max={100}
                      step={1}
                      value={[amplitude]}
                      onValueChange={(value) => setAmplitude(value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="frequency" className="text-sm font-medium">
                        Dažnis: {frequency.toFixed(1)} Hz
                      </label>
                    </div>
                    <Slider
                      id="frequency"
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={[frequency]}
                      onValueChange={(value) => setFrequency(value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="wavelength" className="text-sm font-medium">
                        Bangos Ilgis: {wavelength} m
                      </label>
                    </div>
                    <Slider
                      id="wavelength"
                      min={50}
                      max={400}
                      step={10}
                      value={[wavelength]}
                      onValueChange={(value) => setWavelength(value[0])}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Animacijos nustatymai</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={isPlaying ? "outline" : "default"}
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                    {isPlaying ? "Pauzė" : "Pradėti"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetSimulation}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Atstatyti
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleStep} disabled={isPlaying}>
                    <StepForward className="h-4 w-4 mr-1" />
                    Kitas Žingsnis
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Animacijos Režimai</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="slow-motion" className="text-sm font-medium">
                      Lėtas Judesys
                    </label>
                    <Switch id="slow-motion" checked={slowMotion} onCheckedChange={setSlowMotion} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="step-mode" className="text-sm font-medium">
                      Žingsnis po Žingsnio
                    </label>
                    <Switch
                      id="step-mode"
                      checked={stepMode}
                      onCheckedChange={(checked) => {
                        setStepMode(checked)
                        if (checked) setIsPlaying(false)
                      }}
                    />
                  </div>
                  {stepMode && (
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between">
                        <label htmlFor="time-step" className="text-sm font-medium">
                          Laiko Žingsnis: {timeStep.toFixed(2)} s
                        </label>
                      </div>
                      <Slider
                        id="time-step"
                        min={0.01}
                        max={0.5}
                        step={0.01}
                        value={[timeStep]}
                        onValueChange={(value) => setTimeStep(value[0])}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Apie Stovinčiąsias Bangas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Stovinti banga susidaro, kai dvi to paties dažnio ir amplitudės bangos sklinda priešingomis kryptimis ir tarpusavyje interferuoja. Ši simuliacija demonstruoja du svarbius atvejus:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold">Fiksuoto Galo Atspindys</h3>
                  <p>
                    Kai banga atsispindi nuo fiksuoto galo, ji patiria π (180°) fazės poslinkį. Tai sukuria mazgą (nulinės amplitudės tašką) ties riba. Krintanti ir atspindėta bangos šiame taške viena kitą panaikina.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold">Laisvo Galo Atspindys</h3>
                  <p>
                    Kai banga atsispindi nuo laisvo galo, fazės poslinkio nėra. Tai sukuria antimazgą (maksimalios amplitudės tašką) ties riba. Krintanti ir atspindėta bangos šiame taške viena kitą stiprina.
                  </p>
                </div>
              </div>
              <p>
                Gautas stovinčiosios bangos modelis rodo mazgus (taškus, kurie niekada nejuda) ir antimazgus (maksimalios svyravimo taškus) fiksuotose padėtyse. Atstumas tarp gretimų mazgų arba gretimų antimazgų yra pusė bangos ilgio (λ/2).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

