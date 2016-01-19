import { expect } from 'chai';
import Router5 from 'router5';
import persistentParamsPlugin from '../modules';

const createRouter = () => new Router5([
    { name: 'route1', path: '/route1/:id' },
    { name: 'route2', path: '/route2/:id' }
]);

describe('router5 persistent params plugin', () => {
    let router;

    describe('with an array', () => {
        before(() => {
            router = createRouter();
        });

        it('should be registered with params', () => {
            router.usePlugin(persistentParamsPlugin(['mode']));
        });

        it('should persist specified parameters', (done) => {
            router.start();
            router.navigate('route1', { id: '1', mode: 'dev' }, {}, (err, state) => {
                expect(state.path).to.equal('/route1/1?mode=dev');

                router.navigate('route2', { id: '2' }, {}, (err, state) => {
                    expect(state.path).to.equal('/route2/2?mode=dev');
                    done();
                });
            });
        });

        it('should save value on start', (done) => {
            router.stop();
            router.start('/route2/1?mode=dev', (err, state) => {
                expect(state.params).to.eql({ mode: 'dev', id: '1' });

                router.navigate('route2', { id: '2' }, {}, (err, state) => {
                    expect(state.path).to.equal('/route2/2?mode=dev');
                    done();
                });
            });
        });
    });

    describe('with an object', () => {
        before(() => {
            router.stop();
            router = createRouter();
        });

        it('should be registered with params', () => {
            router.usePlugin(persistentParamsPlugin({'mode': 'dev'}));
        });

        it('should persist specified parameters', (done) => {
            router.start();
            router.navigate('route1', { id: '1' }, {}, (err, state) => {
                expect(state.path).to.equal('/route1/1?mode=dev');
                done();
            });
        });
    });
});
