import { useState } from "react";
import { useRouter } from 'next/router';
import Botao from "../../componentes/botao";
import CabecalhoComAcoes from "../../componentes/cabecalhoComAcoes";
import UploadImagem from "../../componentes/uploadImagem";
import comAutorizacao from "../../hoc/comAutorizacao";
import imagemPublicacao from '../../public/imagens/imagemPublicacao.svg';
import imagemSetaEsquerda from '../../public/imagens/setaEsquerda.svg';
import FeedService from "../../services/FeedService";

const limiteDaDescricao = 255;
const descricaoMinima = 3;
// setar o feedService para conseguir chamar o método dentro do service
const feedService = new FeedService();

function Publicacao() {
    // criar states para guardar os valores
    const [imagem, setImagem] = useState();
    const [descricao, setDescricao] = useState('');
    const [inputImagem, setInputImagem] = useState();
    const [etapaAtual, setEtapaAtual] = useState(1);
    const router = useRouter();

    const estaNaEtapaUm = () => etapaAtual === 1;

    const obterTextoEsquerdaCabecalho = () => {
        if (estaNaEtapaUm() && imagem) {
            return 'Cancelar';
        }

        return '';
    }

    const obterTextoDireitaCabecalho = () => {
        if (!imagem) {
            return '';
        }

        if (estaNaEtapaUm()) {
            return 'Avançar';
        }

        return 'Compartilhar';
    }

    const aoClicarAcaoEsquerdaCabecalho = () => {
        if (estaNaEtapaUm()) {
            inputImagem.value = null; // reseta o estado do input
            setImagem(null);
            return;
        }

        setEtapaAtual(1);
    }

    const aoClicarAcaoDireitaCabecalho = () => {
        if (estaNaEtapaUm()) {
            setEtapaAtual(2);
            return;
        }

        publicar();
    }

    const escreverDescricao = (e) => {
        const valorAtual = e.target.value;
        if (valorAtual.length >= limiteDaDescricao) {
            return;
        }

        setDescricao(valorAtual);
    }

    const obterClassNameCabecalho = () => {
        if (estaNaEtapaUm()) {
            return 'primeiraEtapa';
        }

        return 'segundaEtapa';
    }

    // chamada API para fazer publicação
    const publicar = async () => {
        try {
            // chamar o método de validação se não tiver OK não deixar passar
            if (!validarFormulario()) {
                alert('A descrição precisa ter pelo menos 3 caracteres e a imagem precisa estar selecionada.');
                return;
            }
            // se o formulário estiver OK
            const corpoPublicacao = new FormData();
            corpoPublicacao.append('descricao', descricao);
            corpoPublicacao.append('file', imagem.arquivo);

            await feedService.fazerPublicacao(corpoPublicacao);
            // redireciona para home quando publicar
            router.push('/');
        } catch (error) {
            alert('Erro ao salvar publicação!');
        }
    }

    // método para validar o formulário antes de publicar
    const validarFormulario = () => {
        return (
            descricao.length >= descricaoMinima
            && imagem?.arquivo
        );
    }

    return (
        <div className="paginaPublicacao largura30pctDesktop">
            <CabecalhoComAcoes
                className={obterClassNameCabecalho()}
                iconeEquerda={estaNaEtapaUm() ? null : imagemSetaEsquerda}
                textoEsquerda={obterTextoEsquerdaCabecalho()}
                aoClicarAcaoEsquerda={aoClicarAcaoEsquerdaCabecalho}
                elementoDireita={obterTextoDireitaCabecalho()}
                aoClicarElementoDireita={aoClicarAcaoDireitaCabecalho}
                titulo='Nova publicação'
            />

            <hr className='linhaDivisoria' />

            <div className="conteudoPaginaPublicacao">
                {estaNaEtapaUm()
                    ? (
                        <div className="primeiraEtapa">
                            <UploadImagem
                                setImagem={setImagem}
                                aoSetarAReferencia={setInputImagem}
                                imagemPreviewClassName={!imagem ? 'previewImagemPublicacao' : 'previewImagemSelecionada'}
                                imagemPreview={imagem?.preview || imagemPublicacao.src}
                            />

                            <span className="desktop textoDragAndDrop">Arraste sua foto aqui!</span>

                            <Botao
                                texto='Selecionar uma imagem'
                                manipularClique={() => inputImagem?.click()}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="segundaEtapa">
                                <UploadImagem
                                    setImagem={setImagem}
                                    imagemPreview={imagem?.preview}
                                />

                                <textarea
                                    rows={3}
                                    value={descricao}
                                    placeholder='Escreva uma legenda...'
                                    onChange={escreverDescricao}
                                ></textarea>
                                
                            </div>
                            <hr className='linhaDivisoria' />
                        </>
                    )}
            </div>
        </div>
    );
}

export default comAutorizacao(Publicacao);