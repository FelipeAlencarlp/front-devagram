export class LoadingHelper {
    static exibir() {
        // exibir o loading se encontrar a className oculto
        document
            .querySelector('.loadingContainer')
            ?.classList.remove('oculto');
    }

    static ocultar() {
        // setTimeout para fazer efeito de delay
        setTimeout(() => {
            // esconder o loading se encontrar a className oculto
            document
                .querySelector('.loadingContainer')
                ?.classList.add('oculto');
        }, 500);
    }
}