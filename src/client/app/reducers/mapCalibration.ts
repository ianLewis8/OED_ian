/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {CalibrationModeTypes, MapCalibrationAction, MapCalibrationState} from '../types/redux/map';
import {ActionType} from '../types/redux/actions';
import {CalibratedPoint} from "../utils/calibration";

const defaultState: MapCalibrationState = {
	mode: CalibrationModeTypes.initiate,
	isLoading: false,
	name: 'default',
	note: 'left as blank',
	filename: 'image',
	image: new Image(),
	currentPoint: new CalibratedPoint,
	calibrationSet: [],
	calibrationResult: {},
};

export default function mapCalibration(state = defaultState, action: MapCalibrationAction) {
	switch (action.type) {
		case ActionType.UpdateMapMode:
			return {
				...state,
				mode: action.nextMode
			};
		case ActionType.RequestSelectedMap:
			return {
				...state,
				isLoading: true
			};
		case ActionType.ReceiveSelectedMap:
			return {
				...state,
				isLoading: false,
				name: action.map.name,
				note: action.map.note,
				image: {
					...state.image,
					src: action.map.mapSource
				},
				filename: action.map.filename,
				calibrationResult: {
					origin: action.map.origin,
					opposite: action.map.opposite,
					// do we keep track of maxError too?
				}
			}
		case ActionType.UpdateMapSource:
			return {
				...state,
				name: action.data.name,
				note: action.data.note, //should notes be updated only after upload is complete?
				image: {
					...state.image,
					src: action.data.mapSource
				},
				filename: action.data.filename,
				isLoading: false
			};
		case ActionType.UpdateCurrentCartesian:
			return {
				...state,
				currentPoint: {
					...state.currentPoint,
					cartesian: action.currentCartesian,
				},
			};
		case ActionType.UpdateCurrentGPS:
			return {
				...state,
				currentPoint: {
					...state.currentPoint,
					gps: action.currentGPS,
				}
			};
		case ActionType.ResetCurrentPoint:
			return {
				...state,
				currentPoint: new CalibratedPoint()
			};
		case ActionType.AppendCalibrationSet:
			return {
				...state,
				calibrationSet: [
					...state.calibrationSet.slice(0),
					action.calibratedPoint,
				],
			};
		case ActionType.UpdateCalibrationResults:
			return {
				...state,
				result: action.result
			};
		case ActionType.DisplayMapLoading:
			return {
				...state,
				isLoading: true
			};
		default:
			return state;
	}
}
