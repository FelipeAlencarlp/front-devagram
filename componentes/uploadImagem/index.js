import { useRef, useEffect } from "react";

export default function UploadImagem({
    className = '',
    setImagem,
    imagemPreview,
    imagemPreviewClassName = '',
    aoSetarAReferencia
}) {
    const referenciaInput = useRef(null);

    useEffect(() => {
        if (!aoSetarAReferencia) {
            return;
        }

        aoSetarAReferencia(referenciaInput?.current);
    }, [referenciaInput?.current]);

    const abrirSeletorArquivos = () => {
        referenciaInput?.current?.click();
    }

    const obterUrlDaImagemEAtualizarEstado = (arquivo) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(arquivo);
        
        // garante o carregamento da imagem
        fileReader.onloadend = () => {
            setImagem({
                preview: fileReader.result,
                arquivo
            });
        }
    }

    const aoAleterarImagem = () => {
        if (!referenciaInput?.current?.files?.length) {
            return;
        }

        const arquivo = referenciaInput?.current?.files[0];
        obterUrlDaImagemEAtualizarEstado(arquivo);
    }

    const aoSoltarAImagem = (e) => {
        e.preventDefault();
        // verifica se a propriedade está setada e se tem algum arquivo selecionado
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // pega o primeiro arquivo(caso o usuário selecione varias)
            const arquivo = e.dataTransfer.files[0]; 
            obterUrlDaImagemEAtualizarEstado(arquivo);
        }
    }

    return (
        <div className={`uploadImagemContainer ${className}`}
            onClick={abrirSeletorArquivos}
            onDragOver={e => e.preventDefault()} // evita o comportamento padrão de abrir imagem em outra aba
            onDrop={aoSoltarAImagem} // quando solta a imagem ele captura
        >
            {imagemPreview && (
                <div className="imagemPreviewContainer">
                    <img 
                        src={imagemPreview}
                        alt='imagem preview'
                        className={imagemPreviewClassName}
                    />
                </div>
            )}

            <input
                type='file'
                className='oculto'
                accept="image/*"
                ref={referenciaInput}
                onChange={aoAleterarImagem}
            />
        </div>
    );
}