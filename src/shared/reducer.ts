import {ActionCreator, AsyncActionCreator, AsyncCreator, TypedAction} from "./action";

// 3.
// ActionReducer to definicja funkcji redukującej akcję

type ActionReducer<S, A extends TypedAction = TypedAction> = {
    (state: S, action: A): S;
}

// 2.
// On bedzie wykorzystany do stworzenia mapy reducerów gdzie kluczem będzie type a wartością reducer

type On<S> = {
    reducer: ActionReducer<S>;
    type: string;
}

type ActionType<A> = A extends ActionCreator<infer T, infer C>
    ? ReturnType<C> : A extends AsyncActionCreator<infer T, infer C>
        ? C extends AsyncCreator<infer P> ? P & TypedAction<T> : never : never;

// 6.
// Action Type idzie od lewej za znakiem równości, ponizej w krokach pokaze wam jak dojsc do tego co mamy powyzej
// w typescript mozemy budowac typy warunkowe np. typ A<B> = B extends C ? D : E; czyli typ generyczny przyjmie wartość C jeżeli generyk B rozszerza C i przyjmie E jeżeli nie rozszerza.
// to co chcemy osiągnąć to wyciągnięcie czegos co bedzie wygladac np tak { type: string, activities: Activity[] }
// jako ze w mojej implementacji rozrozniamy dwa główne rodzaje akcji -> asynchroniczne i synchroniczne będziemy musieli skomplikować sobie życie podczas wyciągania typu akcji
// synchroniczny actionCreator zwróci nam TypedAction wiec problemu nie ma wykorzystamy ReturnType i dostaniemy co zwraca dany actionCreator
// A extends ActionCreator<infer T, infer C> ? ReturnType<C>, dzięki infer mogę wyciągnąć generyki ActionCreator - odpowiednio T i C, w końcu wiem że A to ActionCreator
// no ale jest tez asynchroniczny actionCreator który zwraca funkcje przyjmujaca dispatch jako parametr i dopiero ta funkcja zwroci TypedAction
// A extends AsyncActionCreator<infer T, infer C>, wiem z definicji AsyncActionCreator że drugim generykiem jest AsyncCreator ale musze TypeScriptowi to powiedzieć wiec dopisuje
// A extends AsyncActionCreator<infer T, infer C> ? C extends AsyncCreator<infer P>, wiem z definicji AsynCreator ze pierwszym generykiem jest payload który mnie interesuje, w końcu typ juz mam - T
// więc zwracam to co zebrałem jako P & TypedAction<T>
// never oznacza że nie przewiduję scenariusza

// 5.
// OnReducer jest definicją funkcji reducującej dany typ akcji (dokładniej akcje pochodzące z danego actionCreatora)
// mamy dwa generyki - S jakiś stan i A będące albo rozwinieciem ActionCreatora albo AsyncActionCreatora
// to właśnie w tym miejscu dzieje sie wyciaganie payloadu i typu akcji z ActionCreatora za pomoca ActionType
interface OnReducer<S, A extends ActionCreator | AsyncActionCreator> {
    (state: S, action: ActionType<A>): S
}

// 4.
// funkcja on służy do tworzenia obiektów typu On, które zostaną potem zebrane jako tablica i zredukowane (chodzi o operacje na tablicy ;) ) do mapy reducerów

export function on<A extends ActionCreator | AsyncActionCreator, S>(creator: A, reducer: OnReducer<S, A>):On<S> {
    return ({
        reducer: reducer as any,
        type: creator.type
    })
}

// 1.
// w funkcji tworzacej reducer przyjmuje stan poczatkowy z którego wyciągne sobie typ tego stanu (możecie podejrzeć w
// implementacji reducera ze wiem jaki jest typ stanu bez podawania go jawnie!) oraz dowolna liczbe obiektów On które powiedzą mi jak reducować dana akcje

export function createReducer<S extends object, A extends TypedAction>(initialState: S, ...ons: On<S>[]): ActionReducer<S, A>{
    let initAcc : {[key: string]: ActionReducer<S,A>} = {};
    const reduceMap = ons.reduce((acc, current) => {
        acc[current.type] = current.reducer;
        return acc;
    }, initAcc);
    return ((state = initialState, action: A) => {
        const reducer = reduceMap[action.type];
        return reducer? reducer(state, action) : state; // tutaj sprawdzam czy został zdefiniowany reducer jeżeli nie zwróc state
    });
}

