import React, { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type LoadingFCType = {
    loading: boolean;
    error?: string | undefined;
    children: ReactElement;
};

const Loading: FC<LoadingFCType> = ({ loading, error, children }) => {
    const elementType = children?.type?.toString()?.toLowerCase();
    const { t } = useTranslation();

    const renderHandler = () => {
        if (elementType === 'button') {
            const cloneButton = React.cloneElement(children, { disabled: true }, t('globals.btn_loading_lbl'));

            return (
                <>
                    {loading ? (
                        cloneButton
                    ) : error ? (
                        <>
                            {children}
                            <div>
                                <br />
                                <p className="text-danger text-center font-semibold">{error}</p>
                            </div>
                        </>
                    ) : (
                        children
                    )}
                </>
            );
        }
        return (
            <>
                {loading ? (
                    'loading ...'
                ) : error ? (
                    <p className="text-danger text-center font-semibold">{error}</p>
                ) : (
                    children
                )}
            </>
        );
    };

    return renderHandler();
};

export default Loading;
