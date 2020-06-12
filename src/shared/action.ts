
// funkcja sluzy do przypisania readonly typu akcji do actionCreatora
// (chcemy znać typ akcji podczas operowania nad kreatorem jak i podczas operowania nad akcja stad te podwojne przypisywanie jak zobaczycie w kodzie pozniej)

export type Dispatcher = (action: object) => void;

function defineType(type: string, creator: Creator | AsyncCreator) {
    return Object.defineProperty(creator, 'type', {
        value: type,
        writable: false
    });
}

export function createAsyncAction<T extends string>(name: T, action: (dispatch: Dispatcher) => (Promise<any>))
    : AsyncActionCreator<T, () => (dispatch: Dispatcher) => Promise<void>>{
        const creator = () => async (dispatch: Dispatcher) => {
            dispatch({
                type: name
            });
            action(dispatch);
        };
        return defineType(name, creator);
}

export function createPayloadAsyncAction<P extends object, T extends string = string>(name: T, action: (dispatch: Dispatcher, props : P) => (Promise<any> | any))
    : AsyncActionCreator<T, (props: P) => (dispatch: Dispatcher) => Promise<void>>{
    const creator = (props: P) => async (dispatch: Dispatcher) => {
        dispatch({
            type: name,
            ...props
        });
        action(dispatch, props);
    };
    return defineType(name, creator);
}

export function createAction<T extends string>(name: T): ActionCreator<T, () => TypedAction<T>>{
     const creator = () : TypedAction<T> => ({
         type: name
     });
     return defineType(name, creator);
}

export function createPayloadAction<P extends object, T extends string = string>(name: T): ActionCreator<T, (props: P) => P & TypedAction<T>>{
    const creator = (props: P) => ({
        type: name,
        ...props
    });
    return defineType(name, creator);
}

// AsyncCreator to funkcja tworzaca asynchroniczna akcje (wiec de facto funkcje przyjmujace parametr dispatch) i przyjmujaca payload jako argument

export type AsyncCreator<P extends any = any, R = (dispatch: Dispatcher) => Promise<void>> = (props: P) => R;

// Creator to funkcja tworzaca akcje która może przyjmowac payload i zwroci TypedAction
type Creator<P extends any = any> = (props?: P) => TypedAction;

// TypedAction to polaczenie payloadu i typu akcji

export type TypedAction<T extends string = string, P extends object = {}> = {
    type: T
} & P;

// ActionCreator to połączenie Creatora i { type: T } (jak mozecie zobaczyc w definicji TypedAction powyzej)

export type ActionCreator <T extends string = string, C extends Creator = Creator> = TypedAction<T, C>;

export type AsyncActionCreator<T extends string = string, C extends AsyncCreator = AsyncCreator>
    = TypedAction<T, C>;
