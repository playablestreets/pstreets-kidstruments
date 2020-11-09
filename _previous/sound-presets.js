//presets from tonejs ui
// https://tonejs.github.io/examples/polySynth.html
const V = [
	{
		portamento: 0,
		oscillator: { type: 'fatsine4', spread: 60, count: 10 },
		envelope: { attack: 0.4, decay: 0.01, sustain: 1, attackCurve: 'sine', releaseCurve: 'sine', release: 0.4 }
	},
	{ portamento: 0, oscillator: { type: 'square4' }, envelope: { attack: 2, decay: 1, sustain: 0.2, release: 2 } },
	{
		portamento: 0,
		oscillator: { type: 'pulse', width: 0.8 },
		envelope: { attack: 0.01, decay: 0.05, sustain: 0.2, releaseCurve: 'bounce', release: 0.4 }
	},
	{
		portamento: 0.2,
		oscillator: { type: 'sawtooth' },
		envelope: { attack: 0.03, decay: 0.1, sustain: 0.2, release: 0.02 }
	},
	{
		portamento: 0.2,
		oscillator: { partials: [ 1, 0, 2, 0, 3 ] },
		envelope: { attack: 0.001, decay: 1.2, sustain: 0, release: 1.2 }
	},
	{
		portamento: 0.2,
		oscillator: { type: 'fatcustom', partials: [ 0.2, 1, 0, 0.5, 0.1 ], spread: 40, count: 3 },
		envelope: { attack: 0.001, decay: 1.6, sustain: 0, release: 1.6 }
	},
	{
		portamento: 0,
		oscillator: { type: 'fatsawtooth', count: 3, spread: 30 },
		envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.4, attackCurve: 'exponential' }
	},
	{ portamento: 0, oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0.1, release: 1.2 } }
];

const B = [
	{
		portamento: 0,
		oscillator: { type: 'square' },
		filter: { Q: 6, type: 'lowpass', rolloff: -24 },
		envelope: { attack: 0.005, decay: 0.1, sustain: 0.9, release: 1 },
		filterEnvelope: { attack: 0.06, decay: 0.2, sustain: 0.5, release: 2, baseFrequency: 200, octaves: 7, exponent: 2 }
	},
	{
		portamento: 0,
		oscillator: { type: 'sawtooth' },
		filter: { Q: 2, type: 'bandpass', rolloff: -24 },
		envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.6 },
		filterEnvelope: {
			attack: 0.02,
			decay: 0.4,
			sustain: 1,
			release: 0.7,
			releaseCurve: 'linear',
			baseFrequency: 20,
			octaves: 5
		}
	},
	{
		portamento: 0,
		oscillator: { type: 'fmsquare5', modulationType: 'triangle', modulationIndex: 2, harmonicity: 0.501 },
		filter: { Q: 1, type: 'lowpass', rolloff: -24 },
		envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 2 },
		filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.8, release: 1.5, baseFrequency: 50, octaves: 4.4 }
	},
	{
		portamento: 0.08,
		oscillator: { type: 'custom', partials: [ 2, 1, 3, 2, 0.4 ] },
		filter: { Q: 4, type: 'lowpass', rolloff: -48 },
		envelope: { attack: 0.04, decay: 0.06, sustain: 0.4, release: 1 },
		filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.6, release: 1.5, baseFrequency: 50, octaves: 3.4 }
	},
	{
		portamento: 0.01,
		oscillator: { type: 'sawtooth' },
		filter: { Q: 2, type: 'lowpass', rolloff: -24 },
		envelope: { attack: 0.1, decay: 0.1, sustain: 0.6, release: 0.5 },
		filterEnvelope: { attack: 0.05, decay: 0.8, sustain: 0.4, release: 1.5, baseFrequency: 2e3, octaves: 1.5 }
	},
	{
		portamento: 0,
		oscillator: { type: 'pwm', modulationFrequency: 1 },
		filter: { Q: 6, rolloff: -24 },
		envelope: { attack: 0.025, decay: 0.3, sustain: 0.9, release: 2 },
		filterEnvelope: {
			attack: 0.245,
			decay: 0.131,
			sustain: 0.5,
			release: 2,
			baseFrequency: 20,
			octaves: 7.2,
			exponent: 2
		}
	},
	{
		portamento: 0,
		oscillator: { type: 'sawtooth' },
		filter: { Q: 3, type: 'highpass', rolloff: -12 },
		envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.9 },
		filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1, baseFrequency: 800, octaves: -1.2 }
	}
];

const G = [
	{
		frequency: 300,
		envelope: {
			attack: 0.001,
			decay: 0.20958529411764706,
			sustain: 0,
			release: 0.4888,
			attackCurve: 'linear',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		},
		harmonicity: 17.075,
		modulationIndex: 36.84,
		resonance: 378.8235294117647,
		octaves: 2.25
	},
	{
		frequency: 200,
		envelope: {
			attack: 0.01,
			decay: 0.0427764705882353,
			sustain: 0,
			release: 0.4888,
			attackCurve: 'linear',
			decayCurve: 'linear',
			releaseCurve: 'exponential'
		},
		harmonicity: 12,
		modulationIndex: 21.04,
		resonance: 106.19607843137256,
		octaves: 4
	},
	{
		frequency: 300,
		envelope: {
			attack: 0.09584313725490196,
			decay: 0.26265196078431374,
			sustain: 0,
			release: 0.4888,
			attackCurve: 'ripple',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		},
		harmonicity: 0.5,
		modulationIndex: 11.56,
		resonance: 474.0882352941176,
		octaves: 0.99
	},
	{
		frequency: 300,
		envelope: {
			attack: 0.001,
			decay: 0.4,
			sustain: 0,
			release: 0.2,
			attackCurve: 'linear',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		},
		harmonicity: 12,
		modulationIndex: 20,
		resonance: 800,
		octaves: 1.5
	}
];

const U = [
	{
		pitchDecay: 0.0033411764705882354,
		octaves: 0.8300000000000001,
		oscillator: {
			frequency: 440,
			detune: 0,
			phase: 0,
			type: 'fmsine',
			modulationIndex: 0.1,
			modulationType: 'sawtooth',
			harmonicity: 0.44,
			volume: 0,
			mute: !1
		},
		envelope: {
			attack: 6e-4,
			decay: 0.25,
			sustain: 0,
			release: 1.4,
			attackCurve: 'exponential',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		}
	},
	{
		pitchDecay: 0.008,
		octaves: 2,
		oscillator: { type: 'sine', frequency: 440, detune: 0, phase: 0, partialCount: 0, volume: 0, mute: !1 },
		envelope: {
			attack: 6e-4,
			decay: 0.5,
			sustain: 0,
			release: 1.4,
			attackCurve: 'exponential',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		}
	},
	{
		pitchDecay: 0.019729411764705884,
		octaves: 4.845,
		oscillator: {
			frequency: 440,
			detune: 0,
			phase: 0,
			spread: 80.4,
			count: 3,
			type: 'fatsine',
			partialCount: 0,
			volume: 0,
			mute: !1
		},
		envelope: {
			attack: 0.011560784313725491,
			decay: 0.22226666666666667,
			sustain: 0,
			release: 1.4,
			attackCurve: 'sine',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		}
	}
];

const W = [
	{
		harmonicity: 1,
		modulationIndex: 20.848,
		portamento: 0.024,
		oscillator: { type: 'sawtooth9', frequency: 440, detune: 0, phase: 0, partialCount: 9 },
		envelope: {
			attack: 0.012926470588235294,
			decay: 0.05975,
			sustain: 0.16,
			release: 0.18211764705882355,
			attackCurve: 'exponential',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		},
		modulation: {
			type: 'custom',
			frequency: 440,
			detune: 0,
			phase: 0,
			partials: [
				0.8105694691387023,
				0,
				0.0900632743487447,
				0,
				0.03242277876554809,
				0,
				0.016542234064055146,
				0,
				0.010007030483193857,
				0,
				0.00669892123255126,
				0,
				0.004796269048158,
				0,
				0.6,
				0,
				0.0028047386475387615,
				0.4727272727272728,
				0.002245344789857901,
				0,
				0.0018380260071172384,
				0,
				0.0015322674274833694,
				0,
				0.0012969111506219236,
				0.8727272727272728,
				0.0011118922759104286,
				0,
				0.0009638162534348421,
				0,
				0.0008434645880735718,
				0
			],
			partialCount: 32
		},
		modulationEnvelope: {
			attack: 0.012926470588235294,
			decay: 0.08784411764705882,
			sustain: 0,
			release: 0.08627941176470588,
			attackCurve: 'exponential',
			decayCurve: 'exponential',
			releaseCurve: 'cosine'
		}
	},
	{
		harmonicity: 1.515,
		modulationIndex: 6.483999999999999,
		detune: 0,
		oscillator: { type: 'sawtooth3', frequency: 440, detune: 0, phase: 0, partialCount: 3, volume: 0, mute: !1 },
		envelope: {
			attack: 0.010585294117647059,
			decay: 0.27689411764705885,
			sustain: 0,
			release: 0.7328941176470589,
			attackCurve: 'linear',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		},
		modulation: { type: 'square', frequency: 440, detune: 0, phase: 0, partialCount: 0, volume: 0, mute: !1 },
		modulationEnvelope: {
			attack: 0.01,
			decay: 0.05975,
			sustain: 0,
			release: 0.13635,
			attackCurve: 'exponential',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		},
		portamento: 0
	},
	{
		harmonicity: 1.655,
		modulationIndex: 40,
		detune: 0,
		oscillator: { type: 'square', frequency: 440, detune: 0, phase: 0, partialCount: 0, volume: 0, mute: !1 },
		envelope: {
			attack: 0.09584313725490196,
			decay: 0.13174117647058822,
			sustain: 0.25,
			release: 0.5,
			attackCurve: 'exponential',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		},
		modulation: { type: 'triangle', frequency: 440, detune: 0, phase: 0, partialCount: 0, volume: 0, mute: !1 },
		modulationEnvelope: {
			attack: 0.0427764705882353,
			decay: 0.8596519607843138,
			sustain: 0.08,
			release: 3.392894117647059,
			attackCurve: 'linear',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		},
		portamento: 0.15899999999999997
	}
];

const Y = [
	{
		harmonicity: 3.51,
		detune: 0,
		oscillator: { type: 'sawtooth', frequency: 440, detune: 0, phase: 0, partialCount: 0, volume: 0, mute: !1 },
		envelope: {
			attack: 0.01682843137254902,
			decay: 0.2,
			sustain: 0.3,
			release: 0.3,
			attackCurve: 'linear',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		},
		modulation: { type: 'sine', frequency: 440, detune: 0, phase: 0, partialCount: 0, volume: 0, mute: !1 },
		modulationEnvelope: {
			attack: 0.6661147058823529,
			decay: 1.1665411764705882,
			sustain: 1,
			release: 2.151691176470588,
			attackCurve: 'linear',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		},
		portamento: 0
	},
	{
		harmonicity: 2.88,
		detune: 0,
		oscillator: { frequency: 440, detune: 0, phase: 0, width: 0, volume: 0, mute: !1, type: 'pulse' },
		envelope: {
			attack: 0.20958529411764706,
			decay: 1.9219607843137254,
			sustain: 0.08,
			release: 1.5132911764705883,
			attackCurve: 'exponential',
			decayCurve: 'linear',
			releaseCurve: 'exponential'
		},
		modulation: { type: 'square', frequency: 440, detune: 0, phase: 0, partialCount: 0, volume: 0, mute: !1 },
		modulationEnvelope: {
			attack: 0.01682843137254902,
			decay: 1.1665411764705882,
			sustain: 1,
			release: 2.151691176470588,
			attackCurve: 'linear',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		},
		portamento: 0
	},
	{
		harmonicity: 2.355,
		detune: 0,
		oscillator: { type: 'sawtooth', frequency: 440, detune: 0, phase: 0, partialCount: 0, volume: 0, mute: !1 },
		envelope: {
			attack: 0.19729411764705884,
			decay: 1.1072313725490197,
			sustain: 0.3,
			release: 2.8358588235294118,
			attackCurve: 'linear',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		},
		modulation: { type: 'triangle', frequency: 440, detune: 0, phase: 0, partialCount: 0, volume: 0, mute: !1 },
		modulationEnvelope: {
			attack: 0.09584313725490196,
			decay: 1.1665411764705882,
			sustain: 1,
			release: 2.151691176470588,
			attackCurve: 'linear',
			decayCurve: 'exponential',
			releaseCurve: 'exponential'
		},
		portamento: 0
	}
];


